import { APP_BASE_HREF } from '@angular/common';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { createAngularRemoteMount } from '@platform/runtime-mf-adapters/angular';
import { appRoutes } from '../app.routes';
import { HOST_BRIDGE } from '../shared/host-bridge.token';
import { LocaleContext } from '../shared/locale-context';
import { ThemeContext } from '../shared/theme-context';
import { RemoteRoot } from './remote-root';

function getRoutingMode(basename: string): {
  baseHref: string;
  isEmbedded: boolean;
} {
  const baseHref =
    !basename || basename === '/' ? '/' : basename.endsWith('/') ? basename.slice(0, -1) : basename;

  return { baseHref, isEmbedded: baseHref !== '/' };
}

/**
 * Remote mount composition — same HostBridge contract as the React remote.
 *
 * Embedded: no Angular Router (shell owns history via HostBridge.navigation).
 * Standalone: Angular Router + initialNavigation after attach.
 *
 * `createApplication` is async — callers should await `instance.ready`
 * before treating the remote as mounted.
 */
export const mount = createAngularRemoteMount({
  rootComponent: RemoteRoot,
  providers: ({ bridge, basename }) => {
    const { baseHref, isEmbedded } = getRoutingMode(basename);

    return [
      provideBrowserGlobalErrorListeners(),
      ...(isEmbedded
        ? []
        : [provideRouter(appRoutes), { provide: APP_BASE_HREF, useValue: baseHref }]),
      { provide: HOST_BRIDGE, useValue: bridge },
      ThemeContext,
      LocaleContext,
    ];
  },
  configureRoot: ({ component, bridge, container, basename }) => {
    const { baseHref, isEmbedded } = getRoutingMode(basename);

    component.setInput('bridge', bridge);
    component.setInput('mountRoot', container);
    component.setInput('isEmbedded', isEmbedded);
    component.setInput('baseHref', baseHref);
  },
  afterAttach: ({ application, basename }) => {
    const { isEmbedded } = getRoutingMode(basename);

    if (!isEmbedded) {
      // createApplication does not bootstrap → router initializer never runs.
      application.injector.get(Router).initialNavigation();
    }
  },
});
