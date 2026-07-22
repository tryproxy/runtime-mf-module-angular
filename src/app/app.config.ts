import { APP_BASE_HREF } from '@angular/common';
import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { HOST_BRIDGE } from './shared/host-bridge.token';
import { LocaleContext } from './shared/locale-context';
import { ThemeContext } from './shared/theme-context';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: HOST_BRIDGE, useValue: null },
    ThemeContext,
    LocaleContext,
  ],
};
