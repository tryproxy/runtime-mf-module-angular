import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RemoteRoot } from './entry/remote-root';
import { applyModuleTheme } from './shared/apply-module-theme';

/** Standalone CLI entry — defaults when no HostBridge. */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RemoteRoot],
  template: ` <app-remote-root /> `,
})
export class App {
  constructor() {
    applyModuleTheme('dark');
  }
}
