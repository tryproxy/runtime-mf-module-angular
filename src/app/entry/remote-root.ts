import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import type { HostBridge } from '@platform/runtime-mf-contract';
import { applyModuleTheme } from '../shared/apply-module-theme';
import { LocaleContext } from '../shared/locale-context';
import { ThemeContext } from '../shared/theme-context';
import { ModuleNav } from '../ui/module-nav';

@Component({
  selector: 'app-remote-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ModuleNav],
  template: `
    @if (!bridge()) {
      <app-module-nav />
    }
    <router-outlet />
  `,
})
export class RemoteRoot {
  public readonly bridge = input<HostBridge | null>(null);
  public readonly mountRoot = input<HTMLElement | null>(null);

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
  }
}
