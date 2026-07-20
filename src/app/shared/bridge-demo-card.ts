import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import type { AppLocale, HostBridge, ThemeMode } from '@platform/runtime-mf-contract';
import { getCardCopy } from './messages';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:3000';

/**
 * Mirrors React ProtectedMeButton: Card + primary Button + pre.bg-muted.
 * Colors come from shell tokens (--card/--muted/--primary/…) so dark/light match.
 */
@Component({
  selector: 'app-bridge-demo-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }

    .card {
      max-width: 28rem;
      margin: 1.5rem;
      padding: 1.25rem 1.5rem;
      border: 1px solid var(--border, var(--rmf-color-border, #e2e8f0));
      border-radius: var(--radius, var(--rmf-radius-md, 0.625rem));
      background: var(--card, var(--rmf-color-surface, #fff));
      color: var(--card-foreground, var(--rmf-color-fg, #0f172a));
      box-shadow: var(--rmf-shadow-sm, 0 1px 2px rgb(15 23 42 / 0.06));
      font-family: system-ui, sans-serif;
    }

    .card h1 {
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--card-foreground, var(--rmf-color-fg, #0f172a));
    }

    .card p {
      margin: 0 0 0.75rem;
      color: var(--muted-foreground, var(--rmf-color-muted, #64748b));
      line-height: 1.45;
    }

    .meta {
      margin: 0 0 1rem;
      font-size: 0.875rem;
      color: var(--muted-foreground, var(--rmf-color-muted, #64748b));
    }

    /* Same as shadcn default Button (primary) — light chrome in dark theme */
    button {
      appearance: none;
      border: none;
      border-radius: 9999px;
      background: var(--primary, #171717);
      color: var(--primary-foreground, #fafafa);
      padding: 0.45rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error {
      margin: 0.75rem 0 0;
      color: var(--destructive, #dc2626);
      font-size: 0.8rem;
      word-break: break-all;
    }

    /* Same as React: pre className="bg-muted … text-xs" — inherits foreground */
    .me-json {
      display: block;
      margin: 0.75rem 0 0;
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
      line-height: 1.4;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
      background: var(--muted, #f4f4f5) !important;
      color: var(--foreground, #0a0a0a) !important;
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
        <div class="me-json">{{ meJson() }}</div>
      }
    </article>
  `,
})
export class BridgeDemoCard {
  public readonly themeMode = input<ThemeMode>('dark');
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
