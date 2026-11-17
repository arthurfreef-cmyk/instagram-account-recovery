# InstaRecovery

Guia independente de orientação para pessoas que precisam recuperar o acesso à própria conta do Instagram. O projeto direciona usuários aos fluxos oficiais de recuperação e segurança.

**Importante:** InstaRecovery não é afiliada, patrocinada ou administrada pela Meta ou pelo Instagram. Não solicitamos senhas, códigos de autenticação ou credenciais. Os procedimentos oficiais de recuperação do Instagram são gratuitos.

This project was built with [Lovable](https://lovable.dev).

## Desenvolvimento

O projeto usa TanStack Start, React, Vite e Tailwind CSS.

```sh
npm install
npm run dev
```


## Consulta gratuita de perfis públicos do Instagram

A prévia consulta a API pública da **InScrape** pelo endpoint `GET https://api.inscrape.dev/v1/instagram/profile?handle=USUARIO`. A API oferece 100 créditos iniciais gratuitos, sem cartão e sem expiração; a consulta de perfil custa aproximadamente 0,95 crédito. Confira os limites e condições atuais em [InScrape](https://inscrape.dev/).

1. Crie sua conta gratuita em [inscrape.dev](https://inscrape.dev/).
2. Gere/copiei sua chave de API no painel da InScrape.
3. Configure a variável secreta `INSCRAPE_API_KEY` no ambiente de hospedagem.
4. Faça novo deploy para aplicar a variável no servidor.

O exemplo de configuração está em `.env.example`. A chave nunca deve ser colocada em variáveis `VITE_*` ou no código do navegador. Sem a chave, o site informa que a consulta ainda não foi ativada e não inventa dados. A integração retorna apenas informações públicas; não acessa contas privadas, mensagens, senhas ou status interno de recuperação. O serviço é independente e não é afiliado ao Instagram/Meta.
