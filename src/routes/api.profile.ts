import { createFileRoute } from "@tanstack/react-router";

const lookupCache = new Map<string, { expiresAt: number; profile: Record<string, unknown> }>();
const requestWindows = new Map<string, { startedAt: number; count: number }>();

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

        const cacheKey = username.toLowerCase();
        const cached = lookupCache.get(cacheKey);
        if (cached && cached.expiresAt > now) {
          return Response.json({ profile: cached.profile, source: "Unavatar", cached: true }, {
            headers: { "Cache-Control": "private, max-age=60" },
          });
        }

        // Unavatar resolves the public Instagram avatar without an API key.
        const profile = {
          username,
          fullName: null,
          biography: null,
          profilePicUrl: `https://unavatar.io/instagram/${encodeURIComponent(username)}`,
          followers: null,
          following: null,
          posts: null,
          verified: null,
          isPrivate: null,
          externalUrl: null,
        };

        lookupCache.set(cacheKey, { profile, expiresAt: now + 10 * 60 * 1000 });
        return Response.json({ profile, source: "Unavatar", cached: false }, {
          headers: { "Cache-Control": "private, max-age=60" },
        });
      },
    },
  },
});
