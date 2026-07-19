import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { AppLocale, ThemeMode } from '../entry/remote-contract';
import { getCardCopy } from './messages';

/** Tiny fungular card: shows shell theme + i18n via HostBridge. */
@Component({
  selector: 'app-bridge-demo-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .card {
      max-width: 28rem;
      margin: 1.5rem;
      padding: 1.25rem 1.5rem;
      border: 1px solid var(--rmf-color-border, #e2e8f0);
      border-radius: var(--rmf-radius-md, 0.5rem);
      background: var(--rmf-color-surface, #fff);
      color: var(--rmf-color-fg, #0f172a);
      box-shadow: var(--rmf-shadow-sm, 0 1px 2px rgb(15 23 42 / 0.06));
      font-family: system-ui, sans-serif;
    }

    .card h1 {
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .card p {
      margin: 0 0 0.75rem;
      color: var(--rmf-color-muted, #64748b);
      line-height: 1.45;
    }

    .meta {
      margin: 0;
      font-size: 0.875rem;
      color: var(--rmf-color-muted, #64748b);
    }
  `,
  template: `
    <article class="card">
      <h1>{{ copy().title }}</h1>
      <p>{{ copy().body }}</p>
      <p class="meta">{{ copy().themeLabel }}: {{ themeMode() }} · locale: {{ locale() }}</p>
    </article>
  `,
})
export class BridgeDemoCard {
  public readonly themeMode = input<ThemeMode>('light');
  public readonly locale = input<AppLocale>('en');

  public readonly copy = computed(() => getCardCopy(this.locale()));
}
