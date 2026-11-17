import { createFileRoute } from "@tanstack/react-router";

type UnknownRecord = Record<string, unknown>;

const lookupCache = new Map<string, { expiresAt: number; profile: Record<string, unknown> }>();
const requestWindows = new Map<string, { startedAt: number; count: number }>();

function firstValue(source: UnknownRecord, keys: string[]): unknown {
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asCount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[, ]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function safeHttpsUrl(value: unknown): string | null {
  const candidate = asString(value);
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/profile")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = request.headers.get("origin");
        if (origin && origin !== new URL(request.url).origin) {
          return Response.json({ error: "Origem da solicitação não permitida." }, { status: 403 });
        }

        const clientIp = request.headers.get("cf-connecting-ip")
          || request.headers.get("x-real-ip")
          || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
          || "unknown";
        const now = Date.now();
        const windowState = requestWindows.get(clientIp);
        if (windowState && now - windowState.startedAt < 10 * 60 * 1000 && windowState.count >= 12) {
          return Response.json({ error: "Muitas consultas em pouco tempo. Aguarde alguns minutos e tente novamente." }, { status: 429 });
        }
        if (!windowState || now - windowState.startedAt >= 10 * 60 * 1000) {
          requestWindows.set(clientIp, { startedAt: now, count: 1 });
        } else {
          windowState.count += 1;
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Solicitação inválida." }, { status: 400 });
        }

        const username = typeof body === "object" && body !== null && "username" in body
          ? String((body as { username: unknown }).username).trim().replace(/^@/, "")
          : "";
        if (!/^[a-zA-Z0-9._]{1,30}$/.test(username)) {
          return Response.json({ error: "Informe um nome de usuário válido." }, { status: 400 });
        }

        const cached = lookupCache.get(username.toLowerCase());
        if (cached && cached.expiresAt > now) {
          return Response.json({ profile: cached.profile, source: "Apify", cached: true }, {
            headers: { "Cache-Control": "private, max-age=60" },
          });
        }

        const token = process.env.APIFY_API_TOKEN;
        if (!token) {
          return Response.json({
            error: "A consulta de perfis ainda não foi ativada. O administrador precisa configurar a chave da Apify no servidor.",
            code: "PROFILE_LOOKUP_NOT_CONFIGURED",
          }, { status: 503 });
        }

        const actor = process.env.APIFY_INSTAGRAM_ACTOR || "apify~instagram-profile-scraper";
        if (!/^[a-zA-Z0-9_-]+~[a-zA-Z0-9_-]+$/.test(actor)) {
          return Response.json({ error: "O provedor de consulta está configurado incorretamente." }, { status: 500 });
        }

        try {
          const endpoint = new URL(`https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset-items`);
          endpoint.searchParams.set("token", token);
          const upstream = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({ usernames: [username], resultsLimit: 1 }),
            signal: AbortSignal.timeout(45000),
          });

          if (!upstream.ok) {
            return Response.json({
              error: upstream.status === 401 || upstream.status === 403
                ? "A chave do provedor foi recusada. Verifique a configuração da Apify."
                : "O provedor não conseguiu consultar o perfil neste momento. Tente novamente mais tarde.",
            }, { status: upstream.status === 404 ? 404 : 502 });
          }

          const items: unknown = await upstream.json();
          const first = Array.isArray(items) ? items[0] : items;
          if (!first || typeof first !== "object") {
            return Response.json({ error: "Nenhum dado público foi retornado para esse usuário." }, { status: 404 });
          }

          const item = first as UnknownRecord;
          const profile = item.profile && typeof item.profile === "object"
            ? item.profile as UnknownRecord
            : item;
          const returnedUsername = asString(firstValue(profile, ["username", "userName", "handle"]));
          const profilePicUrl = safeHttpsUrl(firstValue(profile, [
            "profilePicUrlHD", "profile_pic_url_hd", "profilePicUrl", "profile_pic_url", "profilePictureUrl", "avatar",
          ]));
          const normalized = {
            username: returnedUsername || username,
            fullName: asString(firstValue(profile, ["fullName", "full_name", "name", "fullNameText"])),
            biography: asString(firstValue(profile, ["biography", "bio", "biographyText"])),
            profilePicUrl,
            followers: asCount(firstValue(profile, ["followersCount", "followers", "followerCount", "edge_followed_by_count"])),
            following: asCount(firstValue(profile, ["followsCount", "following", "followingCount", "edge_follow_count"])),
            posts: asCount(firstValue(profile, ["postsCount", "posts", "mediaCount", "media_count", "edge_owner_to_timeline_media_count"])),
            verified: asBoolean(firstValue(profile, ["verified", "isVerified", "is_verified"])),
            isPrivate: asBoolean(firstValue(profile, ["private", "isPrivate", "is_private"])),
            externalUrl: safeHttpsUrl(firstValue(profile, ["externalUrl", "external_url", "website"])),
          };

          lookupCache.set(username.toLowerCase(), { profile: normalized, expiresAt: now + 10 * 60 * 1000 });
          return Response.json({ profile: normalized, source: "Apify", cached: false }, {
            headers: { "Cache-Control": "private, max-age=60" },
          });
        } catch (error) {
          const timedOut = error instanceof Error && error.name === "TimeoutError";
          return Response.json({
            error: timedOut
              ? "A consulta demorou mais que o esperado. Tente novamente."
              : "Não foi possível consultar o provedor de perfis agora.",
          }, { status: 502 });
        }
      },
    },
  },
});
