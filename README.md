# runtime-mf-module-angular

Minimal Angular Module Federation remote for `runtime-mf-shell`.

## Setup

```bash
pnpm install --frozen-lockfile
```

## Federation remote (shell integration)

Serves `@originjs` `remoteEntry.js` exposing `./mount` (HostBridge mount contract).

```bash
pnpm dev       # http://localhost:5002 — CORS on; remoteEntry at /assets/remoteEntry.js
pnpm build
pnpm preview   # also port 5002
```

Shell env: `VITE_ANGULAR_REMOTE_ENTRY_URL` (default `http://localhost:5002/assets/remoteEntry.js`).

Ports: shell `5000`, React remote `5001`, this Angular remote `5002`.

## Standalone Angular CLI

```bash
pnpm start     # ng serve (default Angular port)
pnpm build:ng
pnpm lint
pnpm test
```
