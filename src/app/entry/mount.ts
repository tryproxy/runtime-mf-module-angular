import { APP_BASE_HREF } from '@angular/common';
import {
  type ApplicationRef,
  type ComponentRef,
  createComponent,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
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
 *
 * Embedded: no Angular Router (shell owns history via HostBridge.navigation).
 * Standalone: Angular Router + initialNavigation after attach.
 */
export const mount: MountRemoteApp = ({ container, bridge, basename }) => {
  let destroyed = false;
  let appRef: ApplicationRef | undefined;
  let componentRef: ComponentRef<RemoteRoot> | undefined;

  const baseHref = normalizeBasename(basename);
  const isEmbedded = baseHref !== '/';

  void createApplication({
    providers: [
      provideBrowserGlobalErrorListeners(),
      ...(isEmbedded
        ? []
        : [provideRouter(appRoutes), { provide: APP_BASE_HREF, useValue: baseHref }]),
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
    componentRef.setInput('isEmbedded', isEmbedded);
    componentRef.setInput('baseHref', baseHref);
    app.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detectChanges();

    if (!isEmbedded) {
      // createApplication does not bootstrap → router initializer never runs.
      app.injector.get(Router).initialNavigation();
    }

    app.tick();
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
