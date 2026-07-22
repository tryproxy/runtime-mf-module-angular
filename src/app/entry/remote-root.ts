import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import type { HostBridge } from '@platform/runtime-mf-contract';
import { angularNavManifest, type AngularNavPageId } from '../model/nav-manifest';
import { angularPageComponent } from '../model/page-components';
import { applyModuleTheme } from '../shared/apply-module-theme';
import { LocaleContext } from '../shared/locale-context';
import { pageIdFromPathname } from '../shared/page-id-from-pathname';
import { ThemeContext } from '../shared/theme-context';
import { ModuleNav } from '../ui/module-nav';

const defaultPageId: AngularNavPageId = angularNavManifest.pages[0]?.id ?? 'overview';

@Component({
  selector: 'app-remote-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ModuleNav, NgComponentOutlet],
  template: `
    @if (!isEmbedded()) {
      <app-module-nav />
      <router-outlet />
    } @else {
      <ng-container [ngComponentOutlet]="activePageComponent()" />
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

  public readonly activePageId = signal<AngularNavPageId>(defaultPageId);

  public readonly activePageComponent = computed(() => angularPageComponent(this.activePageId()));

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
