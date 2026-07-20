import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import type { AppLocale, HostBridge, ThemeMode } from '@platform/runtime-mf-contract';
import { getCardCopy } from './messages';

const API_BASE = 'http://localhost:3000';

/** Shows shell theme/locale + protected GET via bridge.auth.http. */
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
      margin: 0 0 1rem;
      font-size: 0.875rem;
      color: var(--rmf-color-muted, #64748b);
    }

    button {
      appearance: none;
      border: 1px solid var(--rmf-color-border, #e2e8f0);
      border-radius: 0.5rem;
      background: var(--rmf-color-fg, #0f172a);
      color: var(--rmf-color-surface, #fff);
      padding: 0.4rem 0.75rem;
      font-size: 0.875rem;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error {
      margin: 0.75rem 0 0;
      color: #dc2626;
      font-size: 0.8rem;
      word-break: break-all;
    }

    pre {
      margin: 0.75rem 0 0;
      padding: 0.75rem;
      border-radius: 0.5rem;
      background: var(--rmf-color-muted-bg, #f1f5f9);
      font-size: 0.75rem;
      overflow-x: auto;
    }
  `,
  template: `
    <article class="card">
      <h1>{{ copy().title }}</h1>
      <p>{{ copy().body }}</p>
      <p class="meta">{{ copy().themeLabel }}: {{ themeMode() }} · locale: {{ locale() }}</p>
      <p class="meta">{{ copy().meHint }}</p>
      <button type="button" [disabled]="loading()" (click)="requestMe()">
        {{ loading() ? copy().meLoading : copy().meRequest }}
      </button>
      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
      @if (meJson()) {
        <pre>{{ meJson() }}</pre>
      }
    </article>
  `,
})
export class BridgeDemoCard {
  public readonly themeMode = input<ThemeMode>('light');
  public readonly locale = input<AppLocale>('en');
  public readonly bridge = input<HostBridge | null>(null);

  public readonly loading = signal(false);
  public readonly error = signal<string | null>(null);
  public readonly meJson = signal<string | null>(null);

  public readonly copy = computed(() => getCardCopy(this.locale()));

  public async requestMe(): Promise<void> {
    this.error.set(null);
    this.meJson.set(null);

    const bridge = this.bridge();

    if (!bridge) {
      this.error.set(this.copy().meNoBridge);

      return;
    }

    const { http } = bridge.auth;

    if (http.mode !== 'bearer' || !http.getAccessToken) {
      this.error.set(this.copy().meNoBearer);

      return;
    }

    const token = await http.getAccessToken();

    if (!token) {
      this.error.set(this.copy().meNoToken);

      return;
    }

    this.loading.set(true);
    try {
      const response = await fetch(`${API_BASE}/v1/account/me`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const text = await response.text();

        throw new Error(text || `HTTP ${response.status}`);
      }

      this.meJson.set(JSON.stringify(await response.json(), null, 2));
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : this.copy().meFailed);
    } finally {
      this.loading.set(false);
    }
  }
}
