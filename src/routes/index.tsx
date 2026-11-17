import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InstaRecovery — Orientação para recuperar sua conta" },
      { name: "description", content: "Orientações claras para recuperar o acesso à sua conta do Instagram pelos canais oficiais." },
      { property: "og:title", content: "InstaRecovery" },
      { property: "og:description", content: "Encontre o caminho oficial para recuperar o acesso à sua conta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const cases = [
  { t: "Esqueci minha senha", d: "Redefina a senha usando o e-mail ou telefone cadastrado.", url: "https://www.instagram.com/accounts/password/reset/" },
  { t: "Minha conta foi hackeada", d: "Siga o processo oficial de verificação e recuperação de acesso.", url: "https://www.instagram.com/hacked/" },
  { t: "Conta desativada", d: "Peça uma análise ao Instagram caso acredite que a desativação foi um engano.", url: "https://help.instagram.com/366993040048856" },
  { t: "Central de Ajuda", d: "Consulte as orientações oficiais sobre login, segurança e acesso.", url: "https://help.instagram.com/" },
];

const steps = [
  "Na tela de login do aplicativo, toque em “Esqueceu a senha?”.",
  "Informe seu nome de usuário, e-mail ou telefone.",
  "Acesse o link ou informe o código enviado pelo Instagram.",
  "Crie uma nova senha e ative a autenticação de dois fatores.",
];

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card/95 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3" aria-label="InstaRecovery — início">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-hero text-sm font-extrabold text-white shadow-soft">IR</span>
            <span className="text-xl font-bold tracking-tight">Insta<span className="text-primary">Recovery</span></span>
          </a>
          <span className="hidden rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground sm:inline-flex">Guia independente de orientação</span>
        </div>
      </header>

      <section className="bg-hero px-6 py-20 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] opacity-90">InstaRecovery</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-bold md:text-6xl">Encontre o caminho para recuperar sua conta</h1>
        <p className="mx-auto mt-4 max-w-xl text-base opacity-95 md:text-lg">Orientação simples para cada situação, com acesso direto aos canais oficiais do Instagram.</p>
        <p className="mx-auto mt-5 text-sm font-medium opacity-90">Os procedimentos oficiais de recuperação são gratuitos.</p>
      </section>

      <section className="mx-auto -mt-10 grid max-w-5xl gap-4 px-6 md:grid-cols-2">
        {cases.map((c) => (
          <a key={c.t} href={c.url} target="_blank" rel="noopener noreferrer"
            className="group rounded-2xl border bg-card p-6 shadow-soft transition hover:-translate-y-1">
            <h2 className="text-xl font-semibold">{c.t}</h2>
            <p className="mt-2 text-muted-foreground">{c.d}</p>
            <span className="mt-4 inline-block font-medium text-primary">Acessar canal oficial →</span>
          </a>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-2xl font-bold">Passo a passo pelo aplicativo</h2>
        <ol className="mt-6 space-y-4">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4 rounded-xl bg-muted p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <div className="mt-10 rounded-xl border border-destructive/40 bg-destructive/10 p-5">
          <h3 className="font-semibold">Proteja sua conta</h3>
          <p className="mt-1 text-sm text-muted-foreground">Nunca compartilhe sua senha, códigos de login ou códigos de autenticação com terceiros. A InstaRecovery é um guia independente, não é afiliada, patrocinada ou administrada pela Meta ou pelo Instagram. Não solicitamos credenciais nem códigos de acesso.</p>
        </div>
      </section>

      <footer className="border-t px-6 py-8">
        <div className="mx-auto max-w-5xl text-center text-xs leading-6 text-muted-foreground">
          <p className="font-semibold text-foreground">InstaRecovery</p>
          <p>Guia independente de orientação. Instagram e Meta são marcas de seus respectivos proprietários.</p>
          <p>Use sempre os canais oficiais para solicitar a recuperação da sua conta.</p>
        </div>
      </footer>
    </main>
  );
}
