# Payload Modular Starter (Core)

This repo is a **starter scaffold** for building modular, reusable Payload CMS backends.

Step 1 sets up the folder architecture, a Payload config skeleton, and a module registration pattern.

## Use as a per-project starter (clone per site)

This repo is designed for **one independent deployment per repo** (not multi-tenant).

1) Clone the repo for your new project:
- `git clone <this-repo> my-project`
- `cd my-project`

2) Install deps:
- `npm install`

3) Initialize project settings + `.env`:
- `npm run init:project`

### Presets (corporate vs shop)

`npm run init:project` asks for a preset:
- `corporate`: disables commerce + orders, sets `PAYLOAD_SEED_COMMERCE=false`
- `shop`: enables commerce + orders, sets `PAYLOAD_SEED_COMMERCE=true` and `PROJECT_PRESET=shop`

You can always fine-tune toggles later in `src/project/project.config.ts`.

4) Start locally (Docker Compose + Postgres):
- `docker compose up -d --build`

5) Open admin:
- `http://localhost:3000/admin` (or your configured `PAYLOAD_PUBLIC_SERVER_URL`)

Project toggles live in `src/project/project.config.ts`.

## Development seed (dev-only)

This starter includes a dev seed that upserts core globals + sample Pages/Posts, and optionally seeds commerce data if the commerce collections are registered.

Run it by starting Payload in development with:
- `NODE_ENV=development`
- `PAYLOAD_RUN_SEED=true`
- optional: `PAYLOAD_SEED_COMMERCE=false` (skip commerce seed even if enabled)

Warning: do not run seeds in production.

## Docker Compose + Postgres (WIP)

This repo includes:
- `.env.example` for environment placeholders
- `compose.yaml` for a Postgres + app stack
- `docs/deployment.md` for VPS deployment notes (reverse proxy, HTTPS, backups)

## Run locally (Docker Compose + Postgres)

1) Copy `.env.example` to `.env` and set at least:
- `PAYLOAD_SECRET` (use a long random string)

2) Start services:
- `docker compose up -d --build`

3) Open the admin panel:
- `http://localhost:3000/admin`

4) Create the first user:
- Go through the first-user setup screen in the admin UI (first user creation is allowed by design).

Optional dev seed:
- Set `NODE_ENV=development` and `PAYLOAD_RUN_SEED=true` in `.env`, then restart the app container.
