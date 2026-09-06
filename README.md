# t7n.dev

[![CI](https://github.com/roncallyt/t7n-website/actions/workflows/ci.yml/badge.svg)](https://github.com/roncallyt/t7n-website/actions/workflows/ci.yml)

Source code for [t7n.dev](https://t7n.dev), Thomerson Roncally's multilingual personal website for articles and projects.

## Technology

- Nuxt 4 and Vue 3
- Nuxt Content for Markdown content
- Nuxt I18n for English and Brazilian Portuguese
- Tailwind CSS 4
- Vitest and Nuxt Test Utils
- Playwright for browser tests
- Docker and Kamal for production deployment

## Requirements

- Node.js 22
- pnpm 10.25.0

## Local development

```bash
git clone https://github.com/roncallyt/t7n-website.git
cd t7n-website
pnpm install
cp .env.example .env
pnpm dev
```

The development server runs at <http://localhost:3000>.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NUXT_PUBLIC_SITE_URL` | Canonical public URL used by Nuxt and the SEO modules |
| `NUXT_OG_IMAGE_SECRET` | Secret used by the dynamic Open Graph image module |
| `NUXT_LISTMONK_HOST` | URL of the Listmonk instance |
| `NUXT_LISTMONK_LIST_ID` | Newsletter list identifier |
| `NUXT_LISTMONK_API_USERNAME` | Listmonk API username |
| `NUXT_LISTMONK_API_TOKEN` | Listmonk API token |

Use `.env.example` as the local template. Never commit `.env`, `.kamal/secrets`, private keys, tokens, or production credentials.

## Content

The site stores localized Markdown under `content/`:

```text
content/
├── en/
│   ├── articles/
│   └── projects/
└── pt-br/
    ├── articles/
    └── projects/
```

Article front matter requires `title`, `description`, `createdAt`, and `updatedAt`. It may also include `image` and `category`.

Project front matter requires `title`, `description`, `image`, `createdAt`, and `updatedAt`. It may also include `badges` and `tags`.

The collection schemas are defined in `content.config.ts`.

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create the production build |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run Nuxt and Vue type checking |
| `pnpm test` | Run the Vitest test suite |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm test:e2e` | Run the Playwright browser suite |

Install Chromium once before running browser tests locally:

```bash
pnpm test:e2e:install
```

## Deployment

Pull requests targeting `master` must pass the quality and end-to-end jobs. Merges to `master` run the same checks and then deploy the production container with Kamal. Deployment credentials are provided through GitHub Actions secrets and the `production` environment.

## Security

Do not report credentials or exploitable security details in a public issue. Contact the repository owner privately using the contact information on their GitHub profile.

## License

The software source code is licensed under the [MIT License](LICENSE).

The original articles, project descriptions, and other editorial materials under `content/` are copyright © 2024–2026 Thomerson Roncally Araújo Teixeira. All rights are reserved, and those materials are expressly excluded from the MIT License. See [content/LICENSE](content/LICENSE).
