import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BridgeDemoCard } from '../../shared/bridge-demo-card';
import { HOST_BRIDGE } from '../../shared/host-bridge.token';
import { LocaleContext } from '../../shared/locale-context';
import { ThemeContext } from '../../shared/theme-context';

@Component({
  selector: 'app-overview-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BridgeDemoCard],
  template: `
    <app-bridge-demo-card [themeMode]="theme.mode()" [locale]="locale.locale()" [bridge]="bridge" />
  `,
})
export class OverviewPage {
  public readonly bridge = inject(HOST_BRIDGE);
  public readonly theme = inject(ThemeContext);
  public readonly locale = inject(LocaleContext);
}
