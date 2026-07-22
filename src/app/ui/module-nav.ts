import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { angularNavManifest } from '../model/nav-manifest';
import { LocaleContext } from '../shared/locale-context';

@Component({
  selector: 'app-module-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  styles: `
    :host {
      display: block;
      margin: 1rem 1.5rem 0;
      font-family: system-ui, sans-serif;
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    a {
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      border: 1px solid var(--border, #e2e8f0);
      color: var(--muted-foreground, #64748b);
      text-decoration: none;
      font-size: 0.875rem;
    }

    a.active {
      background: var(--primary, #171717);
      border-color: var(--primary, #171717);
      color: var(--primary-foreground, #fafafa);
    }
  `,
  template: `
    <nav aria-label="Angular remote pages">
      @for (page of pages(); track page.id) {
        <a
          [routerLink]="page.link"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: page.exact }"
        >
          {{ page.label }}
        </a>
      }
    </nav>
  `,
})
export class ModuleNav {
  private readonly locale = inject(LocaleContext);

  public readonly pages = computed(() => {
    const locale = this.locale.locale();

    return angularNavManifest.pages.map(page => ({
      id: page.id,
      link: page.segment ? `/${page.segment}` : '/',
      exact: page.segment === '',
      label: page.label[locale] ?? page.label.en,
    }));
  });
}
