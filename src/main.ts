import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Standalone Angular CLI entry (`pnpm start`). Federated mount lives in
// `src/app/entry/mount.ts` and is served via Vite on port 5002 (`pnpm dev`).
bootstrapApplication(App, appConfig).catch(err => console.error(err));
