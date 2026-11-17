import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Recuperar conta do Instagram — Guia passo a passo" },
      { name: "description", content: "Guia seguro para recuperar sua conta do Instagram usando os canais oficiais." },
      { property: "og:title", content: "Recuperar conta do Instagram" },
      { property: "og:description", content: "Passo a passo seguro pelos canais oficiais do Instagram." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const cases = [
  { t: "Esqueci minha senha", d: "Redefina a senha pelo e-mail ou telefone cadastrado.", url: "https://www.instagram.com/accounts/password/reset/" },
  { t: "Minha conta foi hackeada", d: "O Instagram verifica sua identidade e ajuda a recuperar o acesso.", url: "https://www.instagram.com/hacked/" },
  { t: "Conta desativada", d: "Solicite uma revisão se acha que foi um engano.", url: "https://help.instagram.com/366993040048856" },
  { t: "Central de Ajuda", d: "Todas as soluções oficiais de login e acesso.", url: "https://help.instagram.com/" },
];

const steps = [
  "Na tela de login do app, toque em “Esqueceu a senha?”.",
  "Informe seu usuário, e-mail ou telefone.",
  "Abra o link ou código enviado pelo Instagram.",
  "Crie uma senha nova e ative a autenticação em dois fatores.",
];

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="bg-hero px-6 py-20 text-center text-primary-foreground">
        <p className="text-sm uppercase tracking-widest opacity-80">Guia de recuperação</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-bold md:text-6xl">Recupere sua conta do Instagram</h1>
        <p className="mx-auto mt-4 max-w-xl opacity-90">Escolha sua situação e siga o caminho oficial. Rápido, gratuito e seguro.</p>
      </section>

      <section className="mx-auto -mt-10 grid max-w-5xl gap-4 px-6 md:grid-cols-2">
        {cases.map((c) => (
          <a key={c.t} href={c.url} target="_blank" rel="noopener noreferrer"
            className="group rounded-2xl border bg-card p-6 shadow-soft transition hover:-translate-y-1">
            <h2 className="text-xl font-semibold">{c.t}</h2>
            <p className="mt-2 text-muted-foreground">{c.d}</p>
            <span className="mt-4 inline-block font-medium text-primary">Abrir página oficial →</span>
          </a>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-2xl font-bold">Passo a passo pelo app</h2>
        <ol className="mt-6 space-y-4">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4 rounded-xl bg-muted p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <div className="mt-10 rounded-xl border border-destructive/40 bg-destructive/10 p-5">
          <h3 className="font-semibold">Cuidado com golpes</h3>
          <p className="mt-1 text-sm text-muted-foreground">Nunca compartilhe sua senha ou códigos de verificação. O Instagram não cobra para recuperar contas, e "recuperadores" pagos costumam ser golpistas.</p>
        </div>
      </section>
    </main>
  );
}
