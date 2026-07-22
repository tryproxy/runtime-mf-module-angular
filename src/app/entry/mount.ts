import { APP_BASE_HREF } from '@angular/common';
import {
  type ApplicationRef,
  type ComponentRef,
  createComponent,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import type { MountRemoteApp } from '@platform/runtime-mf-contract';
import { appRoutes } from '../app.routes';
import { HOST_BRIDGE } from '../shared/host-bridge.token';
import { LocaleContext } from '../shared/locale-context';
import { ThemeContext } from '../shared/theme-context';
import { RemoteRoot } from './remote-root';

function normalizeBasename(basename: string): string {
  if (!basename || basename === '/') {
    return '/';
  }

  return basename.endsWith('/') ? basename.slice(0, -1) : basename;
}

/**
 * Federation mount seam — same HostBridge contract as the React remote.
 * Vite exposes `./mount` → this module.
 */
export const mount: MountRemoteApp = ({ container, bridge, basename }) => {
  let destroyed = false;
  let appRef: ApplicationRef | undefined;
  let componentRef: ComponentRef<RemoteRoot> | undefined;

  void createApplication({
    providers: [
      provideBrowserGlobalErrorListeners(),
      provideRouter(appRoutes),
      { provide: APP_BASE_HREF, useValue: normalizeBasename(basename) },
      { provide: HOST_BRIDGE, useValue: bridge },
      ThemeContext,
      LocaleContext,
    ],
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
