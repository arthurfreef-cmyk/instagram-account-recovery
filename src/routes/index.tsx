import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, CheckCircle2, Instagram, MessageCircle, Send, ShieldCheck, X } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InstaRecovery | Ajuda para recuperar sua conta" },
      { name: "description", content: "Perdeu o acesso à sua conta do Instagram? Conte o que aconteceu e veja como a InstaRecovery pode ajudar a analisar seu caso e buscar caminhos de recuperação." },
      { property: "og:title", content: "InstaRecovery | Recuperação de contas" },
      { property: "og:description", content: "Atendimento independente para casos de contas do Instagram bloqueadas, invadidas ou desativadas." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

type Message = { from: "bot" | "user"; text: string };
type Stage = "intro" | "welcome" | "username" | "profilePreview" | "followup" | "typing" | "analyzing" | "offer0" | "checkout" | "upsell1" | "upsell2" | "premium" | "done";
type FollowupQuestion = { prompt: string; options: string[] };

const followupsByIssue: Record<string, FollowupQuestion[]> = {
  "Minha conta foi desativada": [
    { prompt: "Quando você tenta entrar, o que aparece?", options: ["Aviso de conta desativada", "Aviso de violação das diretrizes", "Não aparece uma mensagem clara", "Não consigo lembrar"] },
    { prompt: "Você já solicitou uma revisão ou contestou a decisão pelo Instagram?", options: ["Sim, e foi recusada", "Sim, ainda está em análise", "Não, ainda não solicitei", "Não encontrei a opção"] },
    { prompt: "Você ainda consegue acessar o e-mail ou telefone vinculado à conta?", options: ["Sim, os dois", "Apenas um deles", "Não tenho acesso", "Não tenho certeza"] },
  ],
  "Minha conta foi invadida": [
    { prompt: "O que aconteceu depois que você percebeu a invasão?", options: ["Alteraram minha senha", "Alteraram meu e-mail ou telefone", "Publicaram conteúdo sem minha autorização", "Não sei exatamente o que foi alterado"] },
    { prompt: "Você ainda consegue entrar na conta em algum dispositivo?", options: ["Sim, em um dispositivo", "Não, perdi totalmente o acesso", "Consigo entrar, mas não controlar a conta"] },
    { prompt: "Você recebeu algum e-mail avisando sobre alterações na conta?", options: ["Sim, recebi", "Não recebi", "Não tenho mais acesso ao e-mail"] },
    { prompt: "Você já iniciou a recuperação pelos canais oficiais do Instagram?", options: ["Sim, mas não consegui", "Sim, ainda estou aguardando", "Ainda não tentei"] },
  ],
  "Minha conta foi bloqueada": [
    { prompt: "Qual situação descreve melhor o bloqueio?", options: ["Não consigo fazer login", "Minha conta está com recursos limitados", "Recebi um aviso de atividade suspeita", "A conta aparece como suspensa"] },
    { prompt: "O Instagram informou algum motivo para o bloqueio?", options: ["Sim, informou o motivo", "Apenas mostrou um aviso genérico", "Não mostrou nenhuma explicação"] },
    { prompt: "Você já tentou seguir as instruções ou pedir revisão no próprio Instagram?", options: ["Sim, sem sucesso", "Sim, está em análise", "Ainda não tentei"] },
  ],
  "Perdi o acesso à conta": [
    { prompt: "Qual é a principal dificuldade para entrar?", options: ["Esqueci a senha", "Perdi acesso ao e-mail", "Perdi acesso ao telefone", "A autenticação em duas etapas está impedindo o acesso", "Outro problema"] },
    { prompt: "Você ainda tem acesso a algum meio de contato vinculado à conta?", options: ["Sim, ao e-mail", "Sim, ao telefone", "Aos dois", "A nenhum deles", "Não tenho certeza"] },
    { prompt: "Você já tentou redefinir a senha ou usar a opção de recuperar acesso?", options: ["Sim, mas não funcionou", "Sim, mas não recebi o código", "Ainda não tentei"] },
  ],
  "Quero recuperar fotos ou conversas": [
    { prompt: "Que tipo de conteúdo você está tentando localizar?", options: ["Fotos e vídeos publicados", "Stories ou publicações arquivadas", "Conversas e mensagens", "Uma combinação desses conteúdos"] },
    { prompt: "Você ainda consegue acessar sua conta?", options: ["Sim, consigo entrar", "Não, perdi o acesso", "A conta foi desativada ou removida"] },
    { prompt: "Você já solicitou uma cópia das suas informações pelo Instagram?", options: ["Sim, já solicitei", "Tentei, mas não consegui", "Ainda não solicitei", "Não sabia que era possível"] },
  ],
};

const issues = [
  "Minha conta foi desativada",
  "Minha conta foi invadida",
  "Minha conta foi bloqueada",
  "Perdi o acesso à conta",
  "Quero recuperar fotos ou conversas",
];

const offers = [
  {
    title: "Recuperação da conta — sem blindagem",
    price: "R$ 9,90",
    description: "Assistência para organizar o caso e orientar os procedimentos oficiais adequados para tentar recuperar o acesso à conta.",
    bullets: ["Orientação conforme o problema relatado", "Passo a passo dos canais oficiais de recuperação", "Sem o pacote adicional de segurança"],
  },
  {
    title: "Recuperação da conta + blindagem",
    price: "R$ 37,90",
    description: "Inclui a assistência de recuperação e uma etapa adicional de configuração e revisão de segurança para reduzir riscos de novas invasões e perdas de acesso.",
    bullets: ["Tudo que está incluído na recuperação", "Revisão de senha e autenticação em duas etapas", "Orientação para proteger e-mail e dispositivos"],
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
  const [stage, setStage] = useState<Stage>("intro");
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("");
  const [profileUsername, setProfileUsername] = useState("");
  const [followupQuestions, setFollowupQuestions] = useState<FollowupQuestion[]>([]);
  const [followupIndex, setFollowupIndex] = useState(0);
  const [paymentNotice, setPaymentNotice] = useState(false);
  const [pendingReply, setPendingReply] = useState<{ text: string; nextStage: Stage } | null>(null);

  const add = (from: Message["from"], text: string) => setMessages((current) => [...current, { from, text }]);

  useEffect(() => {
    if (!chatOpen || stage !== "intro") return;
    const timer = window.setTimeout(() => {
      add("bot", "Olá! Seja bem-vindo(a) à InstaRecovery. 👋 Sou o assistente virtual da equipe e vou acompanhar sua triagem por aqui.");
      add("bot", "Para começar, me conta: o que aconteceu com sua conta?");
      setStage("welcome");
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [chatOpen, stage]);

  useEffect(() => {
    if (!pendingReply) return;
    const timer = window.setTimeout(() => {
      add("bot", pendingReply.text);
      setStage(pendingReply.nextStage);
      setPendingReply(null);
    }, 850);
    return () => window.clearTimeout(timer);
  }, [pendingReply]);

  useEffect(() => {
    if (stage !== "analyzing") return;
    const timer = window.setTimeout(() => {
      add("bot", "Pronto! Sua triagem gratuita foi concluída. Com base apenas nas respostas que você informou, organizamos os caminhos que podem ser avaliados para o seu caso.");
      add("bot", "Você pode escolher entre a assistência de recuperação por R$ 9,90 ou a opção com uma etapa adicional de segurança por R$ 37,90. A recuperação depende da análise e das decisões do Instagram; nenhum serviço externo pode garanti-la.");
      setStage("offer0");
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [stage]);
  const askNext = (text: string, nextStage: Stage) => {
    setStage("typing");
    setPendingReply({ text, nextStage });
  };
  const chooseIssue = (value: string) => {
    add("user", value);
    setFollowupQuestions(followupsByIssue[value] ?? []);
    setFollowupIndex(0);
    askNext("Entendi. Vou seguir perguntas específicas para esse tipo de situação. Qual é o @ da conta? Não envie senha, códigos ou dados de autenticação.", "username");
  };
  const submitUsername = () => {
    const normalized = username.trim().replace(/^@/, "");
    if (!/^[a-zA-Z0-9._]{1,30}$/.test(normalized)) return;
    setProfileUsername(normalized);
    add("user", `@${normalized}`);
    askNext("Encontrei o endereço público do perfil. Confira se este é o perfil correto antes de continuarmos.", "profilePreview");
  };
  const continueFromProfile = () => {
    const firstQuestion = followupQuestions[0];
    if (firstQuestion) askNext(firstQuestion.prompt, "followup");
    else askNext("Obrigado. Vou organizar as informações que você compartilhou.", "analyzing");
  };
  const answerQuestion = (value: string) => {
    add("user", value);
    const nextIndex = followupIndex + 1;
    if (nextIndex < followupQuestions.length) {
      setFollowupIndex(nextIndex);
      askNext(followupQuestions[nextIndex].prompt, "followup");
    } else {
      askNext("Perfeito, obrigado por responder. Vou organizar suas informações e apresentar os próximos passos possíveis para o seu cenário.", "analyzing");
    }
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
    setStage("intro");
    setMessages([]);
    setUsername("");
    setProfileUsername("");
    setFollowupQuestions([]);
    setFollowupIndex(0);
    setPaymentNotice(false);
    setPendingReply(null);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/10 bg-[#090711] px-5 py-4 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="flex items-center gap-3" aria-label="InstaRecovery">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 text-sm font-extrabold text-white shadow-lg shadow-fuchsia-500/25">IR</span>
            <span className="text-xl font-bold tracking-tight text-white">Insta<span className="text-fuchsia-400">Recovery</span></span>
          </a>
          <span className="hidden rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/70 sm:block">ATENDIMENTO DIGITAL</span>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#090711] px-5 py-24 text-center text-white md:py-32">
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-fuchsia-200"><Instagram size={14} /> Atendimento para contas com problemas de acesso</span>
          <h1 className="mt-7 text-4xl font-black leading-[1.08] tracking-tight md:text-7xl">Recupere sua conta do Instagram <span className="text-fuchsia-300">com a ajuda da InstaRecovery.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/80 md:text-xl">Perder o acesso à sua conta não precisa ser o fim. Se você foi bloqueado, invadido ou perdeu o acesso, a InstaRecovery vai analisar seu caso e conduzir você pelos procedimentos adequados para buscar a recuperação do perfil.</p>
          <button onClick={() => { setMessages([]); setStage("intro"); setPendingReply(null); setChatOpen(true); }} className="mt-9 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-9 py-4 text-base font-extrabold text-white shadow-xl shadow-fuchsia-950/40 transition hover:-translate-y-1 hover:brightness-110 sm:w-auto">
            <MessageCircle size={20} /> COMEÇAR MINHA RECUPERAÇÃO
          </button>
          <p className="mt-5 text-xs text-white/60">Responda algumas perguntas • Veja as opções para o seu caso</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-5 py-14 md:grid-cols-3">
        {[
          ["Conte seu problema", "Explique se a conta foi invadida, bloqueada ou desativada."],
          ["Avalie os caminhos possíveis", "Cada situação é diferente. Identificamos quais procedimentos podem ser aplicáveis."],
          ["Escolha como prosseguir", "Você recebe o escopo e o preço antes de contratar qualquer serviço."],
        ].map(([title, desc], i) => (
          <div key={title} className="rounded-2xl border bg-card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">0{i + 1}</span>
            <h2 className="mt-4 font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>

      <section className="border-y bg-[#100d1b] px-5 py-14 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center">
          <ShieldCheck className="text-fuchsia-400" size={30} />
          <h2 className="text-xl font-extrabold">Atendimento transparente. Seus dados protegidos.</h2>
          <p className="max-w-2xl text-sm leading-6 text-white/65">A InstaRecovery é independente e não representa a Meta ou o Instagram. Nunca envie senha, códigos de autenticação ou cookies. A plataforma decide sobre desbloqueios e reativações; por isso, nenhum terceiro pode garantir esse resultado.</p>
        </div>
      </section>

      <footer className="bg-[#090711] px-5 py-8 text-center text-xs leading-6 text-white/45">
        <p className="font-semibold text-white">InstaRecovery</p>
        <p>Serviço independente de assistência para recuperação e segurança de contas.</p>
        <p>Instagram e Meta são marcas de seus respectivos proprietários.</p>
      </footer>

      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label="Atendimento InstaRecovery">
          <div className="flex h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border bg-card shadow-2xl sm:h-[min(760px,90dvh)] sm:rounded-2xl">
            <div className="flex items-center justify-between bg-[#100d1b] px-4 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600"><MessageCircle size={20} /></div>
                <div><p className="font-bold">Atendimento InstaRecovery</p><p className="text-xs text-white/65">Assistente virtual · triagem de recuperação</p></div>
              </div>
              <button onClick={resetChat} className="rounded-full p-2 transition hover:bg-white/15" aria-label="Fechar atendimento"><X size={20} /></button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto bg-muted/30 p-4">
              <div className="mx-auto w-fit rounded-full bg-background px-3 py-1 text-[10px] text-muted-foreground">Assistente virtual InstaRecovery</div>
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
              {stage === "profilePreview" && profileUsername && (
                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary"><Instagram size={15} /> Prévia do perfil público</div>
                  <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                    <img src={`https://unavatar.io/instagram/${encodeURIComponent(profileUsername)}`} alt={`Foto de perfil de @${profileUsername}`} className="h-16 w-16 rounded-full border object-cover" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">@{profileUsername}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Perfil público do Instagram</p>
                      <a href={`https://www.instagram.com/${encodeURIComponent(profileUsername)}/`} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary">Abrir no Instagram <ArrowRight size={12} /></a>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">Esta prévia usa uma fonte externa e pode não carregar para perfis privados, indisponíveis ou com restrições. O Instagram não informa publicamente o estado interno da conta; esta tela não confirma se ela está suspensa, invadida ou em análise.</p>
                  <button onClick={continueFromProfile} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 text-sm font-extrabold text-white">Sim, é minha conta — continuar <ArrowRight size={16} /></button>
                </div>
              )}
              {stage === "followup" && followupQuestions[followupIndex] && (
                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wide text-primary">Perguntas do seu caso</span><span className="text-xs text-muted-foreground">{followupIndex + 1} de {followupQuestions.length}</span></div>
                  <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 transition-all" style={{ width: `${((followupIndex + 1) / followupQuestions.length) * 100}%` }} /></div>
                  <p className="mb-3 text-sm font-semibold text-foreground">{followupQuestions[followupIndex].prompt}</p>
                  <div className="space-y-2">
                    {followupQuestions[followupIndex].options.map((option, index) => (
                      <button key={option} onClick={() => answerQuestion(option)} className="group flex w-full items-center gap-3 rounded-xl border border-border/80 bg-background px-3.5 py-3 text-left text-sm font-medium transition hover:border-primary hover:bg-primary/5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{String.fromCharCode(65 + index)}</span><span className="flex-1">{option}</span><ArrowRight size={15} className="text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {stage === "typing" && (
                <div className="flex justify-start"><div className="rounded-2xl rounded-bl-sm border bg-card px-4 py-3 text-xs text-muted-foreground"><span className="mr-2 inline-flex gap-1 align-middle"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:120ms]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:240ms]" /></span>Digitando uma resposta...</div></div>
              )}
              {stage === "analyzing" && (
                <div className="rounded-2xl border bg-card p-4">
                  <div className="flex items-center gap-2 font-semibold"><span className="h-2 w-2 animate-pulse rounded-full bg-fuchsia-500" /> Organizando suas respostas...</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Estamos reunindo as informações da triagem para mostrar o escopo da análise inicial. Esta etapa pode levar até 10 segundos.</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500" /></div>
                </div>
              )}
              {stage === "offer0" && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm">
                    <p className="font-bold text-emerald-700">Diagnóstico gratuito concluído</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">A triagem não tem custo. Escolha abaixo o serviço que deseja contratar.</p>
                  </div>
                  <OfferCard offer={offers[0]} onChoose={() => showCheckout(0)} />
                  <OfferCard offer={offers[1]} onChoose={() => showCheckout(1)} />
                </div>
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
    <div className="rounded-2xl border border-fuchsia-500/30 bg-card p-5 shadow-lg shadow-fuchsia-950/10">
      <div className="flex items-center justify-between gap-3"><span className="text-xs font-extrabold uppercase tracking-wider text-fuchsia-600">Serviço opcional</span><span className="rounded-full bg-fuchsia-500/10 px-2.5 py-1 text-xs font-bold text-fuchsia-600">InstaRecovery</span></div>
      <h3 className="mt-3 text-lg font-bold">{offer.title}</h3>
      <p className="mt-2 text-3xl font-extrabold">{offer.price}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{offer.description}</p>
      <ul className="mt-4 space-y-2">{offer.bullets.map((item) => <li key={item} className="flex gap-2 text-xs leading-5"><Check size={14} className="mt-0.5 shrink-0 text-primary" />{item}</li>)}</ul>
      <button onClick={onChoose} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-4 text-sm font-extrabold text-white shadow-lg shadow-fuchsia-900/20 transition hover:-translate-y-0.5 hover:brightness-110">Escolher este serviço <ArrowRight size={16} /></button>
    </div>
  );
}
