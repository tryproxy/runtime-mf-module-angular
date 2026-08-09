# runtime-mf-module-angular

Angular Module Federation remote (`runtime_mf_module_angular`, shell alias `angular_remote`, port **5002**) for `runtime-mf-shell`. Same HostBridge / mount contract as the React remote — different UI stack.

Contract: `@platform/runtime-mf-contract` via `github:tryproxy/runtime-mf-contract`.

---

## What this remote provides

| Surface       | Notes                                                          |
| ------------- | -------------------------------------------------------------- |
| `./mount`     | Federation expose — async `createApplication`; returns `ready` |
| `nav.json`    | Pre-mount page list for shell chrome (from `nav-manifest.ts`)  |
| Pages         | Overview + About — under shell basename `/remote-angular`      |
| HostBridge DI | `HOST_BRIDGE` token + theme/locale contexts                    |

## What it must obey

1. Implement `mount({ container, bridge, basename })` → `{ unmount(), ready }`; readiness resolves after Angular bootstrap and cleanup is idempotent, including disposal during bootstrap.
2. **Embedded:** no Angular Router fight — follow `bridge.navigation`; shell owns history.
3. **Standalone:** Angular Router + `initialNavigation` after attach is OK.
4. Follow **HostBridge** for theme / locale / auth — never `localStorage` for tokens.
5. Keep **`nav-manifest.ts`** the single source for pages (routes + `nav.json`).

---

## Key files

| Path                                                    | Why it matters                              |
| ------------------------------------------------------- | ------------------------------------------- |
| `src/app/entry/mount.ts`                                | Federation mount / unmount + `ready`        |
| `src/app/entry/remote-root.ts`                          | Root component wired to bridge              |
| `src/app/model/nav-manifest.ts`                         | Pages list → embedded pages + `nav.json`    |
| `src/app/model/page-components.ts`                      | Page id → component map                     |
| `src/app/shared/host-bridge.token.ts`                   | DI token for `HostBridge`                   |
| `src/app/shared/theme-context.ts` / `locale-context.ts` | Bridge → Angular contexts                   |
| `src/app/app.routes.ts`                                 | Standalone routes only                      |
| `src/vite-main.ts`                                      | Vite standalone entry                       |
| `vite.config.ts`                                        | Federation expose + nav.json emit           |
| `vercel.json`                                           | Deploy rewrites; keep `/nav.json` reachable |

---

## Local run

The Module Federation Vite producer emits `mf-manifest.json` and `remoteEntry.js` for the production build.

```bash
pnpm install --frozen-lockfile
pnpm build && pnpm preview   # federation → http://localhost:5002
pnpm dev                     # local development
pnpm start                   # optional ng serve
```

Shell env: `VITE_ANGULAR_REMOTE_MANIFEST_URL` (default `http://localhost:5002/mf-manifest.json`). Set `VITE_API_BASE_URL` to the Nest API origin, not the shell.

This is a browser-only producer. Its manifest omits the Module Federation plugin's default SSR entry metadata because this build does not emit an SSR entry.
