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
          return Response.json({ profile: cached.profile, source: "InScrape", cached: true }, {
            headers: { "Cache-Control": "private, max-age=60" },
          });
        }

        const token = process.env.INSCRAPE_API_KEY;
        if (!token) {
          return Response.json({
            error: "A consulta gratuita ainda não foi ativada. O administrador precisa configurar a chave da InScrape no servidor.",
            code: "PROFILE_LOOKUP_NOT_CONFIGURED",
          }, { status: 503 });
        }

                try {
          const endpoint = new URL("https://api.inscrape.dev/v1/instagram/profile");
          endpoint.searchParams.set("handle", username);
          const upstream = await fetch(endpoint, {
            method: "GET",
            headers: { "x-api-key": token, "Accept": "application/json" },
            signal: AbortSignal.timeout(30000),
          });

          if (!upstream.ok) {
            return Response.json({
              error: upstream.status === 401 || upstream.status === 403
                ? "A chave da InScrape foi recusada. Confira se a chave gratuita foi copiada corretamente."
                : "A InScrape não conseguiu consultar o perfil neste momento. Tente novamente mais tarde.",
            }, { status: upstream.status === 404 ? 404 : 502 });
          }

          const payload: unknown = await upstream.json();
          if (!payload || typeof payload !== "object") {
            return Response.json({ error: "A InScrape retornou uma resposta inválida." }, { status: 502 });
          }
          const profile = payload as UnknownRecord;
          const returnedUsername = asString(firstValue(profile, ["handle", "username"]));
          const profilePicUrl = safeHttpsUrl(firstValue(profile, [
            "profile_pic_url", "profile_pic_url_hd", "profile_picture_url", "avatar",
          ]));
          const normalized = {
            username: returnedUsername || username,
            fullName: asString(firstValue(profile, ["full_name", "fullName", "name"])),
            biography: asString(firstValue(profile, ["biography", "bio"])),
            profilePicUrl,
            followers: asCount(firstValue(profile, ["follower_count", "followers_count", "followers"])),
            following: asCount(firstValue(profile, ["following_count", "follows_count", "following"])),
            posts: asCount(firstValue(profile, ["media_count", "posts_count", "posts"])),
            verified: asBoolean(firstValue(profile, ["is_verified", "verified"])),
            isPrivate: asBoolean(firstValue(profile, ["is_private", "private"])),
            externalUrl: safeHttpsUrl(firstValue(profile, ["external_url", "website"])),
          };
          if (!returnedUsername && !profile.full_name && !profile.profile_pic_url) {
            return Response.json({ error: "Nenhum dado público foi retornado para esse usuário." }, { status: 404 });
          }

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
