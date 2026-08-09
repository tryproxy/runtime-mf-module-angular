import { APP_BASE_HREF } from '@angular/common';
import {
  type ApplicationRef,
  type ComponentRef,
  createComponent,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import type { MountRemoteApp, RemoteAppInstance } from '@platform/runtime-mf-contract';
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
 *
 * `createApplication` is async — callers should await `instance.ready`
 * before treating the remote as mounted.
 */
export const mount: MountRemoteApp = ({ container, bridge, basename }) => {
  let destroyed = false;
  let appRef: ApplicationRef | undefined;
  let componentRef: ComponentRef<RemoteRoot> | undefined;

  const baseHref = normalizeBasename(basename);
  const isEmbedded = baseHref !== '/';

  const ready = createApplication({
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

  const reportCleanupFailure = (error: unknown) => {
    try {
      bridge.telemetry.captureException(error, {
        lifecycleStage: 'cleanup',
      });
    } catch {
      // Cleanup and observability failures must not create unhandled rejections.
    }
  };

  const cleanup = () => {
    try {
      componentRef?.destroy();
    } catch (error) {
      reportCleanupFailure(error);
    }
    componentRef = undefined;

    try {
      appRef?.destroy();
    } catch (error) {
      reportCleanupFailure(error);
    }
    appRef = undefined;

    try {
      container.replaceChildren();
    } catch (error) {
      reportCleanupFailure(error);
    }
  };

  const instance = {
    ready: ready.then(() => undefined),
    unmount() {
      if (destroyed) {
        return;
      }

      destroyed = true;
      void ready.then(cleanup, cleanup);
    },
  };

  // `ready` lands in contract 0.3.1+; keep providing it at runtime on 0.3.0 types.
  return instance as RemoteAppInstance;
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
