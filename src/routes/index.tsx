import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Instagram, MessageCircle, Send, ShieldCheck, X } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InstaRecovery | Atendimento para recuperação de contas" },
      { name: "description", content: "Conte seu problema à InstaRecovery e conheça as opções de serviço para seu caso." },
      { property: "og:title", content: "InstaRecovery | Recuperação de contas" },
      { property: "og:description", content: "Atendimento independente para casos de contas do Instagram bloqueadas, invadidas ou desativadas." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

type Message = { from: "bot" | "user"; text: string };
type Stage = "welcome" | "issue" | "username" | "offer0" | "checkout" | "upsell1" | "upsell2" | "premium" | "done";

const issues = [
  "Minha conta foi desativada",
  "Minha conta foi invadida",
  "Minha conta foi bloqueada",
  "Perdi o acesso à conta",
  "Quero recuperar fotos ou conversas",
];

const offers = [
  {
    title: "Diagnóstico e início do processo",
    price: "R$ 9,90",
    description: "Análise inicial do relato, identificação do tipo de problema e preparação dos primeiros passos aplicáveis ao seu caso.",
    bullets: ["Triagem do problema informado", "Identificação das opções de recuperação", "Orientação inicial personalizada"],
  },
  {
    title: "Recuperação avançada e segurança",
    price: "R$ 37,90",
    description: "Uma etapa adicional de assistência para organizar o caso e preparar as solicitações e medidas de segurança cabíveis.",
    bullets: ["Análise mais detalhada do caso", "Preparação das informações para contestação", "Revisão de medidas de segurança"],
  },
  {
    title: "Recuperação de fotos e conteúdos",
    price: "R$ 19,90",
    description: "Assistência para localizar conteúdos disponíveis e orientar solicitações de cópia dos dados da conta.",
    bullets: ["Orientação para solicitar seus dados", "Verificação de opções para fotos e vídeos", "Ajuda para localizar conteúdos arquivados"],
  },
];

const premiumOffers = [
  {
    title: "Recuperação Premium",
    price: "R$ 597,00",
    description: "Atendimento individual com análise aprofundada e escopo de trabalho personalizado para casos complexos.",
  },
  {
    title: "Proteção e recuperação completa",
    price: "R$ 797,00",
    description: "Serviço ampliado com análise do caso, revisão de segurança e plano personalizado de proteção digital.",
  },
];

function Index() {
  const [chatOpen, setChatOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("welcome");
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Olá! 👋 Sou o assistente virtual da InstaRecovery. Vou entender o que aconteceu com sua conta e apresentar as opções de serviço disponíveis." },
    { from: "bot", text: "Para começar, me conta: qual situação você está enfrentando?" },
  ]);
  const [issue, setIssue] = useState("");
  const [username, setUsername] = useState("");
  const [paymentNotice, setPaymentNotice] = useState(false);

  const add = (from: Message["from"], text: string) => setMessages((current) => [...current, { from, text }]);
  const chooseIssue = (value: string) => {
    setIssue(value);
    add("user", value);
    add("bot", "Entendi. Obrigado por explicar. Qual é o @usuário da conta que precisa de ajuda? Não envie senha, códigos de login ou códigos de autenticação.");
    setStage("username");
  };
  const submitUsername = () => {
    if (!username.trim()) return;
    add("user", username.startsWith("@") ? username : `@${username}`);
    add("bot", "Certo! Com essas informações iniciais, podemos começar pela triagem do seu caso. A primeira etapa é o Diagnóstico e início do processo.");
    add("bot", "Este serviço custa R$ 9,90 e inclui triagem do problema informado, identificação das opções aplicáveis e preparação dos primeiros passos.");
    setStage("offer0");
  };
  const showCheckout = (offerIndex: number) => {
    add("user", `Quero contratar por ${offers[offerIndex].price}`);
    add("bot", "O checkout Pix precisa estar conectado à plataforma de pagamento para gerar uma cobrança individual e confirmar o pagamento. No momento, essa integração ainda não está configurada neste projeto.");
    setPaymentNotice(true);
    setStage("checkout");
  };
  const nextUpsell = (index: number) => {
    const offer = offers[index];
    add("bot", `Como próxima etapa opcional, temos ${offer.title} por ${offer.price}. ${offer.description}`);
    setStage(index === 1 ? "upsell1" : "upsell2");
  };
  const openPremium = () => {
    add("bot", "Para casos que exigem um trabalho individual mais amplo, também existem opções premium. Elas só devem ser contratadas após você receber o escopo completo e confirmar que ele atende à sua necessidade.");
    setStage("premium");
  };
  const resetChat = () => {
    setChatOpen(false);
    setStage("welcome");
    setMessages([
      { from: "bot", text: "Olá! 👋 Sou o assistente virtual da InstaRecovery. Vou entender o que aconteceu com sua conta e apresentar as opções de serviço disponíveis." },
      { from: "bot", text: "Para começar, me conta: qual situação você está enfrentando?" },
    ]);
    setIssue("");
    setUsername("");
    setPaymentNotice(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card/95 px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="flex items-center gap-3" aria-label="InstaRecovery">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-hero text-sm font-extrabold text-white shadow-soft">IR</span>
            <span className="text-xl font-bold tracking-tight">Insta<span className="text-primary">Recovery</span></span>
          </a>
          <span className="hidden text-xs text-muted-foreground sm:block">Atendimento independente</span>
        </div>
      </header>

      <section className="relative overflow-hidden bg-hero px-5 py-24 text-center text-white md:py-32">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full border-[42px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full border-[48px] border-white/10" />
        <div className="relative mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest"><Instagram size={14} /> Serviço de recuperação de contas</span>
          <h1 className="mt-7 text-4xl font-extrabold leading-tight md:text-6xl">Problemas para acessar sua conta do Instagram?</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/90 md:text-xl">Conte o que aconteceu. Nossa equipe pode analisar seu caso e orientar as etapas de recuperação disponíveis para sua situação.</p>
          <button onClick={() => setChatOpen(true)} className="mt-9 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl transition hover:-translate-y-0.5 sm:w-auto">
            <MessageCircle size={20} /> Iniciar atendimento
          </button>
          <p className="mt-5 text-xs text-white/75">Você será atendido pelo assistente virtual da InstaRecovery.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-5 py-14 md:grid-cols-3">
        {[
          ["Atendimento inicial", "Conte o que aconteceu com sua conta e informe apenas os dados básicos necessários."],
          ["Análise do seu caso", "Identificamos quais caminhos e serviços podem ser aplicáveis à situação relatada."],
          ["Próximas etapas", "Você conhece cada serviço e seu preço antes de decidir se deseja contratar."],
        ].map(([title, desc], i) => (
          <div key={title} className="rounded-2xl border bg-card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">0{i + 1}</span>
            <h2 className="mt-4 font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>

      <section className="border-y bg-muted/40 px-5 py-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center">
          <ShieldCheck className="text-primary" size={30} />
          <h2 className="text-xl font-bold">Sua segurança vem primeiro</h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">A InstaRecovery é um serviço independente, sem vínculo com a Meta ou o Instagram. Nunca solicitamos senha, códigos de autenticação, cookies ou códigos de recuperação. A decisão de reativar ou desbloquear uma conta pertence à plataforma e não pode ser garantida por terceiros.</p>
        </div>
      </section>

      <footer className="px-5 py-8 text-center text-xs leading-6 text-muted-foreground">
        <p className="font-semibold text-foreground">InstaRecovery</p>
        <p>Serviço independente de assistência para recuperação e segurança de contas.</p>
        <p>Instagram e Meta são marcas de seus respectivos proprietários.</p>
      </footer>

      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label="Atendimento InstaRecovery">
          <div className="flex h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border bg-card shadow-2xl sm:h-[min(760px,90dvh)] sm:rounded-2xl">
            <div className="flex items-center justify-between bg-hero px-4 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"><MessageCircle size={20} /></div>
                <div><p className="font-bold">InstaRecovery</p><p className="text-xs text-white/75">Assistente virtual · atendimento online</p></div>
              </div>
              <button onClick={resetChat} className="rounded-full p-2 transition hover:bg-white/15" aria-label="Fechar atendimento"><X size={20} /></button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto bg-muted/30 p-4">
              <div className="mx-auto w-fit rounded-full bg-background px-3 py-1 text-[10px] text-muted-foreground">Conversa com assistente virtual</div>
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.from === "user" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border bg-card"}`}>{message.text}</div>
                </div>
              ))}
              {stage === "welcome" && (
                <div className="space-y-2">
                  {issues.map((item) => <button key={item} onClick={() => chooseIssue(item)} className="block w-full rounded-xl border bg-card px-4 py-3 text-left text-sm font-medium transition hover:border-primary hover:bg-primary/5">{item}<ArrowRight size={15} className="float-right mt-0.5 text-primary" /></button>)}
                </div>
              )}
              {stage === "username" && (
                <div className="flex gap-2">
                  <input value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitUsername()} placeholder="@seuusuario" className="min-w-0 flex-1 rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                  <button onClick={submitUsername} disabled={!username.trim()} className="rounded-xl bg-primary px-4 text-primary-foreground disabled:opacity-40" aria-label="Enviar usuário"><Send size={18} /></button>
                </div>
              )}
              {stage === "offer0" && (
                <OfferCard offer={offers[0]} onChoose={() => showCheckout(0)} />
              )}
              {stage === "checkout" && (
                <div className="rounded-2xl border bg-card p-4">
                  <div className="flex items-center gap-2 font-bold"><CheckCircle2 className="text-primary" size={20} /> Próxima etapa: pagamento</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">A oferta foi selecionada. Para receber o Pix e confirmar a contratação automaticamente, é necessário conectar um provedor de pagamento. Nenhuma cobrança foi gerada nesta versão.</p>
                  <button onClick={() => setPaymentNotice(true)} className="mt-4 w-full rounded-xl border px-4 py-3 text-sm font-semibold">Entendi</button>
                  {paymentNotice && <p className="mt-3 text-xs text-muted-foreground">Checkout aguardando integração com o meio de pagamento.</p>}
                </div>
              )}
              {(stage === "upsell1" || stage === "upsell2") && (
                <div className="space-y-3">
                  <OfferCard offer={offers[stage === "upsell1" ? 1 : 2]} onChoose={() => showCheckout(stage === "upsell1" ? 1 : 2)} />
                  <button onClick={() => stage === "upsell1" ? nextUpsell(2) : openPremium()} className="w-full rounded-xl border bg-card px-4 py-3 text-sm font-semibold">Continuar sem este serviço <ArrowRight className="ml-1 inline" size={15} /></button>
                </div>
              )}
              {stage === "premium" && (
                <div className="space-y-3">
                  {premiumOffers.map((offer) => (
                    <div key={offer.title} className="rounded-2xl border bg-card p-4">
                      <p className="font-bold">{offer.title}</p><p className="mt-1 text-2xl font-extrabold">{offer.price}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{offer.description}</p>
                      <p className="mt-3 text-xs text-muted-foreground">O escopo detalhado deve ser apresentado e aceito antes da contratação.</p>
                    </div>
                  ))}
                  <button onClick={() => { add("user", "Prefiro encerrar por aqui."); add("bot", "Tudo bem! Obrigado por conversar com a InstaRecovery."); setStage("done"); }} className="w-full rounded-xl border bg-card px-4 py-3 text-sm font-semibold">Encerrar atendimento</button>
                </div>
              )}
              {stage === "done" && <div className="rounded-xl border bg-card p-4 text-sm">Atendimento encerrado. Você pode fechar esta janela.</div>}
            </div>
            <div className="border-t bg-card px-4 py-3 text-center text-[10px] leading-4 text-muted-foreground">Não envie senhas, códigos de login ou dados de autenticação. A contratação e o pagamento devem ocorrer com informações claras sobre o serviço.</div>
          </div>
        </div>
      )}
    </main>
  );
}

function OfferCard({ offer, onChoose }: { offer: typeof offers[number]; onChoose: () => void }) {
  return (
    <div className="rounded-2xl border border-primary/30 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3"><span className="text-xs font-bold uppercase tracking-wider text-primary">Serviço disponível</span><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">Oferta</span></div>
      <h3 className="mt-3 text-lg font-bold">{offer.title}</h3>
      <p className="mt-2 text-3xl font-extrabold">{offer.price}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{offer.description}</p>
      <ul className="mt-4 space-y-2">{offer.bullets.map((item) => <li key={item} className="flex gap-2 text-xs leading-5"><Check size={14} className="mt-0.5 shrink-0 text-primary" />{item}</li>)}</ul>
      <button onClick={onChoose} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground transition hover:opacity-90">Continuar para pagamento <ArrowRight size={16} /></button>
    </div>
  );
}
