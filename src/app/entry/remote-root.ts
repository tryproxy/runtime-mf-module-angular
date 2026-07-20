import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { BridgeDemoCard } from '../shared/bridge-demo-card';
import { applyModuleTheme } from '../shared/apply-module-theme';
import type { AppLocale, HostBridge, ThemeMode } from '@platform/runtime-mf-contract';

@Component({
  selector: 'app-remote-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BridgeDemoCard],
  template: `
    <app-bridge-demo-card [themeMode]="themeMode()" [locale]="locale()" [bridge]="bridge()" />
  `,
})
export class RemoteRoot {
  public readonly bridge = input<HostBridge | null>(null);
  public readonly mountRoot = input<HTMLElement | null>(null);

  public readonly themeMode = signal<ThemeMode>('dark');
  public readonly locale = signal<AppLocale>('en');

  constructor() {
    effect(onCleanup => {
      const bridge = this.bridge();
      const mountRoot = this.mountRoot();

      if (!bridge) {
        applyModuleTheme(this.themeMode(), mountRoot);

        return;
      }

      const applyTheme = () => {
        const mode = bridge.theme.getSnapshot().mode;

        this.themeMode.set(mode);
        applyModuleTheme(mode, mountRoot);
      };

      const applyLocale = () => {
        this.locale.set(bridge.i18n.getSnapshot().locale);
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
