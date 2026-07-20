import {
  type ApplicationRef,
  type ComponentRef,
  createComponent,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import type { MountRemoteApp } from '@platform/runtime-mf-contract';
import { RemoteRoot } from './remote-root';

/**
 * Federation mount seam — same HostBridge contract as the React remote.
 * Vite exposes `./mount` → this module.
 */
export const mount: MountRemoteApp = ({ container, bridge }) => {
  let destroyed = false;
  let appRef: ApplicationRef | undefined;
  let componentRef: ComponentRef<RemoteRoot> | undefined;

  void createApplication({
    providers: [provideBrowserGlobalErrorListeners()],
  }).then(app => {
    if (destroyed) {
      app.destroy();

      return;
    }

    appRef = app;

    const host = document.createElement('div');

    container.appendChild(host);

    componentRef = createComponent(RemoteRoot, {
      environmentInjector: app.injector,
      hostElement: host,
    });
    componentRef.setInput('bridge', bridge);
    componentRef.setInput('mountRoot', container);
    app.attachView(componentRef.hostView);
  });

  return {
    unmount() {
      destroyed = true;
      componentRef?.destroy();
      appRef?.destroy();
      container.replaceChildren();
    },
  };
};

/** Re-export contract types from the federation entry. */
export type {
  AppLocale,
  HostBridge,
  HostTelemetry,
  MountRemoteApp,
  RemoteAppInstance,
  TelemetryProps,
  ThemeMode,
} from '@platform/runtime-mf-contract';
