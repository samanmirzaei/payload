# Deployment notes (self-hosting on a VPS)

This project is intended to run as a self-hosted Payload server with a separate reverse proxy for HTTPS.

## Recommended setup

- Run Payload behind a reverse proxy:
  - Caddy (simple) or Nginx
- Terminate TLS at the proxy (HTTPS required for real deployments).
- Point your proxy to the Payload container port (default `3000`).

## Public URL configuration

Set `PAYLOAD_PUBLIC_SERVER_URL` to the public HTTPS URL, for example:
- `https://cms.example.com`

This should match what browsers use to access the admin UI and APIs.

## Secrets handling

- Never commit `.env` to git.
- Generate a strong `PAYLOAD_SECRET` for production (long random string).
- Consider using your VPS’s secret manager or a protected `.env` file on disk.

## Database (Postgres)

- Use the Postgres service in `compose.yaml` for local/dev.
- For production, you can:
  - keep Postgres in Docker on the VPS (simplest), or
  - use a managed Postgres (more resilient)

Backups:
- Database: regular `pg_dump` or volume-level backups
- Uploads: back up the uploads volume (or switch to cloud storage later)

## Uploads persistence

The compose file includes an `uploads` volume.

TODO: confirm/standardize the upload path when the server runtime is finalized.

## Seed data (dev only)

This repo includes dev seed support via `PAYLOAD_RUN_SEED=true` in development.

Do not run seeds in production.

