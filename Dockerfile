FROM node:20-bookworm-slim AS base

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json ./

# Minimal, simple install (no lockfile required for this starter).
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

