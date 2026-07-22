import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import type { HostBridge } from '@platform/runtime-mf-contract';
import { AboutPage } from '../features/about/about-page';
import { OverviewPage } from '../features/overview/overview-page';
import type { AngularNavPageId } from '../model/nav-manifest';
import { applyModuleTheme } from '../shared/apply-module-theme';
import { LocaleContext } from '../shared/locale-context';
import { pageIdFromPathname } from '../shared/page-id-from-pathname';
import { ThemeContext } from '../shared/theme-context';
import { ModuleNav } from '../ui/module-nav';

@Component({
  selector: 'app-remote-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ModuleNav, OverviewPage, AboutPage],
  template: `
    @if (!isEmbedded()) {
      <app-module-nav />
      <router-outlet />
    } @else {
      @switch (activePageId()) {
        @case ('about') {
          <app-about-page />
        }
        @default {
          <app-overview-page />
        }
      }
    }
  `,
})
export class RemoteRoot {
  public readonly bridge = input<HostBridge | null>(null);
  public readonly mountRoot = input<HTMLElement | null>(null);
  /** When false (standalone Vite), show ModuleNav + Angular Router. */
  public readonly isEmbedded = input(true);
  /** Shell basename, e.g. `/remote-angular` (embedded only). */
  public readonly baseHref = input('/');

  public readonly activePageId = signal<AngularNavPageId>('overview');

  private readonly theme = inject(ThemeContext);
  private readonly locale = inject(LocaleContext);

  constructor() {
    effect(onCleanup => {
      const bridge = this.bridge();
      const mountRoot = this.mountRoot();

      if (!bridge) {
        applyModuleTheme(this.theme.mode(), mountRoot);

        return;
      }

      const applyTheme = () => {
        const mode = bridge.theme.getSnapshot().mode;

        this.theme.mode.set(mode);
        applyModuleTheme(mode, mountRoot);
      };

      const applyLocale = () => {
        this.locale.locale.set(bridge.i18n.getSnapshot().locale);
      };

      applyTheme();
      applyLocale();

      const unsubTheme = bridge.theme.subscribe(applyTheme);
      const unsubLocale = bridge.i18n.subscribe(applyLocale);

      onCleanup(() => {
        unsubTheme();
        unsubLocale();
      });
    });

    // Embedded: shell owns the URL. Do not run Angular Router (it fights history).
    effect(onCleanup => {
      if (!this.isEmbedded()) {
        return;
      }

      const bridge = this.bridge();
      const baseHref = this.baseHref();

      if (!bridge) {
        return;
      }

      const syncPage = () => {
        this.activePageId.set(
          pageIdFromPathname(bridge.navigation.getSnapshot().pathname, baseHref),
        );
      };

      syncPage();
      onCleanup(bridge.navigation.subscribe(syncPage));
    });
  }
}
