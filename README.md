# runtime-mf-module-angular

Minimal Angular Module Federation remote for `runtime-mf-shell`.

## Setup

```bash
pnpm install --frozen-lockfile
```

## Federation remote (shell integration)

Serves `@originjs` `remoteEntry.js` exposing `./mount` (HostBridge mount contract).

```bash
pnpm build
pnpm preview   # http://localhost:5002 — CORS on; remoteEntry at /assets/remoteEntry.js
```

`pnpm dev` is for **standalone** Vite (no `remoteEntry.js` — `@originjs` only emits it on build). For shell federation use **build + preview**.

```bash
pnpm dev       # standalone only (no remoteEntry)
```

Shell env: `VITE_ANGULAR_REMOTE_ENTRY_URL` (default `http://localhost:5002/assets/remoteEntry.js`).

API base (Vite build-time): `VITE_API_BASE_URL` (default `http://localhost:3000`). Set this on Vercel to your Nest API origin — not the shell URL.

Ports: shell `5000`, React remote `5001`, this Angular remote `5002`.

## Standalone Angular CLI

```bash
pnpm start     # ng serve (default Angular port)
pnpm build:ng
pnpm lint
pnpm test
```
