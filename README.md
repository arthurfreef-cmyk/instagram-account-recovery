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


## Consulta de perfis públicos do Instagram

A prévia do perfil usa um endpoint do servidor em `/api/profile` e o ator **Apify Instagram Profile Scraper**. O token fica somente no servidor; não coloque a chave em variáveis `VITE_*` nem no código do navegador.

1. Crie uma conta na [Apify](https://apify.com/) e habilite o ator [Instagram Profile Scraper](https://apify.com/apify/instagram-profile-scraper).
2. Copie o token em [Apify API & Integrations](https://console.apify.com/account/integrations).
3. Configure `APIFY_API_TOKEN` como variável de ambiente/secret no ambiente de hospedagem (e no arquivo `.env` local para desenvolvimento).
4. Opcionalmente, configure `APIFY_INSTAGRAM_ACTOR`; o padrão é `apify~instagram-profile-scraper`.
5. Faça novo deploy para aplicar a variável no servidor.

O exemplo de configuração está em `.env.example`. Sem o token, a aplicação informa que a consulta ainda não foi ativada e não inventa dados. O provedor pode cobrar pelo uso; confira os preços e limites diretamente na Apify. Os resultados dependem da disponibilidade dos dados públicos e podem estar incompletos ou desatualizados. Esta integração não acessa contas privadas nem revela o status interno de uma conta.
