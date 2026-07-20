import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BridgeDemoCard } from './shared/bridge-demo-card';
import { applyModuleTheme } from './shared/apply-module-theme';

/** Standalone CLI entry — defaults when no HostBridge. */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BridgeDemoCard],
  template: ` <app-bridge-demo-card themeMode="dark" locale="en" /> `,
})
export class App {
  constructor() {
    applyModuleTheme('dark');
  }
}
