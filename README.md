# Ótica Dumas

Aplicação pública e painel administrativo da Ótica Dumas, construída com Next.js, TypeScript, Prisma e PostgreSQL.

## Desenvolvimento

1. Configure `DATABASE_URL`, `AUTH_SECRET` e, para imagens, as variáveis do Cloudinary em `.env` (use `.env.example` como referência).
2. Gere o cliente: `npm.cmd run prisma:generate`.
3. Aplique as migrations: `npm.cmd run prisma:migrate`.
4. Popule o ambiente inicial: `npm.cmd run prisma:seed`.
5. Inicie: `npm.cmd run dev`.

O catálogo público consulta apenas produtos ativos no PostgreSQL. A disponibilidade é tratada diretamente com a equipe pelo WhatsApp; não há valores de produtos na experiência pública ou administrativa.

## Estrutura

- `app/`: páginas públicas, painel e APIs.
- `components/`: componentes compartilhados e formulários.
- `lib/`: autenticação, catálogo, WhatsApp e configuração de banners.
- `prisma/`: schema, migrations e seed.
- `public/banners/`: arquivos promocionais substituíveis.

## Segurança

As APIs administrativas validam a sessão no servidor e verificam o usuário ativo e o papel `ADMIN`. O cookie de sessão é `httpOnly`, `sameSite=lax` e `secure` em produção. Nunca versione secrets reais.

## Validação

```bash
npm.cmd run prisma:generate
npx.cmd prisma validate
npx.cmd tsc --noEmit
npx.cmd next build
```

Detalhes da arquitetura de banners estão em [`docs/banners.md`](docs/banners.md).

## Executando com Docker

O projeto possui uma imagem de produção baseada em Node 22 Debian slim. O
container executa o Next.js standalone e aplica apenas migrations pendentes
com `prisma migrate deploy` antes de iniciar a aplicação. O seed nunca é
executado automaticamente.

1. Clone o projeto e entre na pasta.
2. Copie `.env.example` para `.env` e substitua os valores de exemplo.
3. Para desenvolvimento local com PostgreSQL no Compose, execute:

```bash
docker compose up --build
```

4. Acesse `http://localhost:3000`. O banco local fica persistido no volume
   `otica-dumas-postgres`.

No Compose, `DATABASE_URL` da aplicação aponta para o serviço `postgres`,
nunca para `localhost`. Para criar as categorias e o primeiro administrador,
execute o seed manualmente, depois que o banco estiver disponível, usando os
valores `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` do seu ambiente:

```bash
# Use a URL do PostgreSQL publicado pelo Compose ao executar o seed no host.
# Configure também ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD no ambiente.
npm.cmd run prisma:seed
```

No PowerShell, por exemplo:

```powershell
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/otica_dumas?schema=public"
$env:ADMIN_EMAIL = "admin@example.invalid"
$env:ADMIN_PASSWORD = "change-this-local-password"
npm.cmd run prisma:seed
```

## Deploy em produção

Construa a imagem sem copiar arquivos `.env` para ela:

```bash
docker build -t otica-dumas .
```

Execute-a fornecendo as variáveis pelo ambiente da hospedagem ou por um
arquivo externo:

```bash
docker run --rm -p 3000:3000 --env-file .env otica-dumas
```

Em produção:

- `DATABASE_URL` deve apontar para um PostgreSQL externo ou gerenciado.
- `AUTH_SECRET` deve ser um segredo longo, aleatório e exclusivo do ambiente.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e
  `CLOUDINARY_API_SECRET` devem ser configuradas para habilitar uploads.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` é a configuração pública do contato.
- `NEXT_PUBLIC_SITE_URL` é opcional e pode ser configurada quando o domínio
  definitivo estiver conectado.
- `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` são usados somente pelo seed
  manual inicial.
- A plataforma deve fornecer `PORT` quando utilizar uma porta diferente de
  3000. O servidor escuta em `0.0.0.0`.

O endpoint público `GET /api/health` retorna `{ "status": "ok" }` e pode ser
usado como healthcheck. O domínio e HTTPS ficam sob responsabilidade da
plataforma ou do proxy reverso; não há domínio fixo na configuração da
aplicação.

As migrations são aplicadas pelo entrypoint a cada inicialização de forma
idempotente com `prisma migrate deploy`. Se uma migration falhar, o container
encerra e não inicia o Next.js. Não use `prisma migrate dev` em produção.

## Verificação local

Depois de iniciar o Compose, verifique:

- `/`
- `/catalogo`
- `/sobre`
- `/contato`
- `/login`
- `/admin`
- `/api/health`

As operações administrativas e o upload devem ser testados com as credenciais
e as variáveis do ambiente local. O PostgreSQL do Compose é apenas para
desenvolvimento; em produção, use o PostgreSQL externo da hospedagem.

O fluxo recomendado de verificação é: abrir o site público, consultar o
catálogo, acessar `/login`, entrar em `/admin`, criar/editar/excluir produtos,
gerenciar categorias e administradores, testar upload no Cloudinary e alternar
entre os temas claro e escuro.
