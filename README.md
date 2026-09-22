# Luis Cedillo — Portfolio

Monorepo for [luiscedillo.com](https://luiscedillo.com).

| Directory | Status | Stack |
|---|---|---|
| `portfolio-v4/` | **Current production version** — see `PLAN.md` and `portfolio-v4/README.md` | Astro 7, static, EN/ES, Cloudflare Pages |
| `portfolio-v3/` | Archived third iteration | Next.js 16 |
| `portfolio-v2/` | Archived second iteration | React 19, Vite, i18next |
| `portfolio-v1/` | Archived first iteration, restored from the `dev` branch without legacy credentials | Create React App |

## Run V4

```bash
pnpm install:v4   # once
pnpm dev          # http://localhost:4321  (alias of pnpm dev:v4)
pnpm build:v4     # build + 404 mirrors + i18n parity + asset/JS budgets
pnpm check:v4     # astro check
```

Astro 7 runs `astro dev` as a background daemon: `pnpm --dir portfolio-v4 exec astro dev stop` shuts it down.

## License

All rights reserved. This code is not open source.
