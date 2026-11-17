import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InstaRecovery | Serviço de recuperação de contas do Instagram" },
      { name: "description", content: "Atendimento independente para análise e recuperação de contas do Instagram: contas invadidas, desativadas, bloqueadas ou sem acesso." },
      { property: "og:title", content: "InstaRecovery | Recuperação de contas" },
      { property: "og:description", content: "Conte com um serviço independente para analisar seu caso e conduzir as etapas possíveis de recuperação." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const offers = [
  {
    name: "Diagnóstico e abertura do caso",
    price: "R$ 9,90",
    detail: "O primeiro passo para entender o bloqueio e iniciar seu processo.",
    features: ["Análise inicial do problema informado", "Identificação do tipo de restrição ou perda de acesso", "Verificação das rotas oficiais aplicáveis", "Orientação dos próximos passos para o seu caso"],
    action: "Começar diagnóstico",
    featured: false,
  },
  {
    name: "Recuperação avançada",
    price: "R$ 37,90",
    detail: "Tratamento mais completo para casos que exigem análise e preparação de solicitações.",
    features: ["Revisão detalhada das informações do caso", "Preparação e organização das informações necessárias", "Orientação para contestação ou verificação oficial", "Revisão das medidas de segurança após recuperar o acesso"],
    action: "Ver recuperação avançada",
    featured: true,
  },
  {
    name: "Recuperação de conteúdo",
    price: "R$ 19,90",
    detail: "Ajuda para localizar e solicitar dados e conteúdos que ainda estejam disponíveis.",
    features: ["Orientação para solicitar uma cópia das informações", "Verificação de opções para fotos e vídeos", "Ajuda para localizar conteúdos arquivados ou baixados", "Explicação clara dos limites de recuperação"],
    action: "Recuperar meus conteúdos",
    featured: false,
  },
];

const premium = [
  {
    name: "Recuperação Premium",
    price: "R$ 597",
    detail: "Atendimento individual para casos complexos, com análise aprofundada e plano de execução.",
    features: ["Análise individual do histórico do caso", "Organização de evidências e informações", "Preparação das solicitações e contestações cabíveis", "Atendimento prioritário durante o escopo contratado"],
  },
  {
    name: "Proteção e recuperação completa",
    price: "R$ 797",
    detail: "Serviço ampliado para recuperação, revisão de segurança e redução de riscos futuros.",
    features: ["Tudo do serviço Recuperação Premium", "Revisão de sessões, dispositivos e configurações", "Orientação para reforçar e-mail e autenticação em dois fatores", "Plano personalizado de proteção após a recuperação"],
  },
];

const situations = [
  ["Conta invadida", "Alguém alterou seus dados ou você perdeu o controle da conta."],
  ["Conta desativada", "Seu perfil foi desativado e você deseja contestar a decisão."],
  ["Conta bloqueada", "Você não consegue entrar ou recebeu uma restrição de acesso."],
  ["Perdi o acesso", "Você não tem mais acesso ao e-mail, telefone ou método de login."],
];

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-card/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3" aria-label="InstaRecovery — início">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-hero text-sm font-extrabold text-white shadow-soft">IR</span>
            <span className="text-xl font-bold tracking-tight">Insta<span className="text-primary">Recovery</span></span>
          </a>
          <a href="#servicos" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Ver serviços</a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-hero px-5 py-20 text-center text-white md:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute -left-20 -top-24 h-80 w-80 rounded-full border-[40px] border-white" />
          <div className="absolute -bottom-44 -right-20 h-96 w-96 rounded-full border-[48px] border-white" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">Serviço independente de recuperação</span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">Sua conta do Instagram foi bloqueada ou desativada?</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/90 md:text-xl">Conte com a InstaRecovery para analisar seu caso e conduzir as etapas possíveis para tentar recuperar seu acesso.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#servicos" className="w-full rounded-xl bg-white px-7 py-4 font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 sm:w-auto">Quero recuperar minha conta</a>
            <a href="#como-funciona" className="w-full rounded-xl border border-white/40 bg-white/10 px-7 py-4 font-semibold text-white transition hover:bg-white/15 sm:w-auto">Como funciona</a>
          </div>
          <p className="mt-5 text-xs text-white/75">Atendimento independente. Não somos o Instagram nem a Meta.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Podemos ajudar em diferentes situações</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">O que aconteceu com sua conta?</h2>
          <p className="mt-4 text-muted-foreground">Cada caso exige uma análise própria. Entenda em quais situações nosso serviço pode atuar.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {situations.map(([title, description], index) => (
            <div key={title} className="flex gap-4 rounded-2xl border bg-card p-6 shadow-soft">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
              <div><h3 className="text-lg font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="servicos" className="scroll-mt-24 bg-muted/50 px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Escolha o serviço</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Comece a tratar do seu caso</h2>
            <p className="mt-4 text-muted-foreground">Valores e escopos apresentados com clareza. Você sabe o que está contratando antes de iniciar.</p>
          </div>
          <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
            {offers.map((offer) => (
              <article key={offer.name} className={`relative flex flex-col rounded-2xl border bg-card p-7 shadow-soft ${offer.featured ? "border-primary ring-2 ring-primary/20" : ""}`}>
                {offer.featured && <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">Mais completo</span>}
                <h3 className="text-xl font-bold">{offer.name}</h3>
                <p className="mt-3 text-3xl font-extrabold tracking-tight">{offer.price}</p>
                <p className="mt-3 min-h-12 text-sm leading-6 text-muted-foreground">{offer.detail}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {offer.features.map((feature) => <li key={feature} className="flex gap-2 text-sm leading-5"><span className="font-bold text-primary">✓</span><span>{feature}</span></li>)}
                </ul>
                <a href="#como-funciona" className={`mt-8 rounded-xl px-5 py-3.5 text-center text-sm font-bold transition hover:opacity-90 ${offer.featured ? "bg-primary text-primary-foreground" : "border border-primary/30 text-primary hover:bg-primary/5"}`}>{offer.action}</a>
              </article>
            ))}
          </div>
          <div className="mt-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-primary">Atendimento especializado</p>
              <h2 className="mt-3 text-3xl font-bold">Soluções premium para casos complexos</h2>
              <p className="mt-4 text-muted-foreground">Para situações que exigem análise individual e um escopo de serviço mais amplo.</p>
            </div>
            <div className="mx-auto mt-9 grid max-w-4xl gap-5 md:grid-cols-2">
              {premium.map((offer) => (
                <article key={offer.name} className="flex flex-col rounded-2xl border bg-card p-7 shadow-soft">
                  <h3 className="text-xl font-bold">{offer.name}</h3>
                  <p className="mt-3 text-3xl font-extrabold">{offer.price}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{offer.detail}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {offer.features.map((feature) => <li key={feature} className="flex gap-2 text-sm leading-5"><span className="font-bold text-primary">✓</span><span>{feature}</span></li>)}
                  </ul>
                  <a href="#como-funciona" className="mt-8 rounded-xl border border-primary/30 px-5 py-3.5 text-center text-sm font-bold text-primary transition hover:bg-primary/5">Conhecer o serviço</a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-24 mx-auto max-w-5xl px-5 py-16 md:py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Processo transparente</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Como funciona a recuperação</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">O serviço é realizado por etapas, de acordo com o tipo de problema e os recursos oficiais disponíveis para sua conta.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["01", "Analisamos seu caso", "Você informa o que aconteceu. Identificamos o tipo de bloqueio e as opções aplicáveis."],
            ["02", "Preparamos o processo", "Organizamos as informações e orientamos ou executamos as etapas contratadas que estejam ao nosso alcance."],
            ["03", "Acompanhamos as etapas", "Você recebe informações sobre o trabalho realizado e os próximos passos disponíveis."],
          ].map(([number, title, description]) => (
            <div key={number} className="rounded-2xl border bg-card p-6">
              <span className="text-sm font-extrabold text-primary">{number}</span>
              <h3 className="mt-3 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border bg-muted/50 p-6">
          <h3 className="font-bold">Importante sobre os resultados</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">A InstaRecovery presta um serviço independente de análise e assistência no processo de recuperação. Não temos vínculo, acesso interno ou poder de decisão sobre os sistemas da Meta/Instagram. A liberação ou reativação depende da análise da plataforma e, por isso, não podemos prometer desbloqueio garantido. O pagamento remunera os serviços descritos no plano contratado, não a aprovação do Instagram.</p>
        </div>
      </section>

      <section className="bg-hero px-5 py-14 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold md:text-4xl">Não sabe por onde começar?</h2>
          <p className="mt-4 leading-7 text-white/85">O diagnóstico inicial ajuda a identificar o tipo de problema e quais caminhos podem ser tentados no seu caso.</p>
          <a href="#servicos" className="mt-7 inline-flex rounded-xl bg-white px-7 py-4 font-bold text-slate-900 transition hover:-translate-y-0.5">Ver opções de recuperação</a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-center text-3xl font-bold">Perguntas frequentes</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["Vocês garantem que minha conta será desbloqueada?", "Não. A decisão final é do Instagram. Garantimos apenas a execução do escopo contratado, com transparência sobre as etapas realizadas."],
            ["Vocês são do Instagram ou da Meta?", "Não. A InstaRecovery é um serviço independente e não representa, não é afiliada e não possui acesso interno à Meta ou ao Instagram."],
            ["Preciso informar minha senha ou código de login?", "Não. Nunca solicitamos senha, códigos de autenticação, códigos de recuperação ou cookies de sessão."],
            ["Vocês conseguem recuperar conversas apagadas?", "Não é possível garantir a recuperação de mensagens apagadas. Podemos orientar a solicitação e a localização de dados que ainda estejam disponíveis para sua conta."],
          ].map(([question, answer]) => (
            <div key={question} className="rounded-2xl border bg-card p-6">
              <h3 className="font-bold">{question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t px-5 py-9">
        <div className="mx-auto max-w-6xl text-center text-xs leading-6 text-muted-foreground">
          <p className="font-bold text-foreground">InstaRecovery</p>
          <p>Serviço independente de assistência para recuperação e segurança de contas.</p>
          <p>Instagram e Meta são marcas de seus respectivos proprietários. A InstaRecovery não possui vínculo com essas empresas.</p>
          <p className="mt-2">Nunca compartilhe senhas, códigos de autenticação ou códigos de recuperação com terceiros.</p>
        </div>
      </footer>
    </main>
  );
}
