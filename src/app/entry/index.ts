/**
 * Federation mount seam (app-level platform entry).
 * Vite exposes `./mount` → this slice.
 */
export { mount } from './mount';
export type {
  AppLocale,
  HostBridge,
  HostTelemetry,
  MountRemoteApp,
  RemoteAppInstance,
  TelemetryProps,
  ThemeMode,
} from '@platform/runtime-mf-contract';
