import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LocaleContext } from '../../shared/locale-context';

const copy = {
  en: {
    title: 'About',
    body: 'Second Angular remote page for nav-manifest PoC verification.',
  },
  ru: {
    title: 'О модуле',
    body: 'Вторая страница Angular remote для проверки PoC nav-manifest.',
  },
} as const;

@Component({
  selector: 'app-about-page',
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
    }

    .card p {
      margin: 0;
      color: var(--muted-foreground, var(--rmf-color-muted, #64748b));
      line-height: 1.45;
    }
  `,
  template: `
    <article class="card">
      <h1>{{ text().title }}</h1>
      <p>{{ text().body }}</p>
    </article>
  `,
})
export class AboutPage {
  private readonly locale = inject(LocaleContext);

  public readonly text = computed(() => copy[this.locale.locale()] ?? copy.en);
}
