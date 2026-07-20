import type { ThemeMode } from '@platform/runtime-mf-contract';

/** Keep `data-rmf-theme` + `.dark` in sync (document + optional mount root). */
export function applyModuleTheme(theme: ThemeMode, mountRoot?: HTMLElement | null): void {
  document.documentElement.dataset['rmfTheme'] = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');

  if (mountRoot) {
    mountRoot.dataset['rmfTheme'] = theme;
    mountRoot.classList.toggle('dark', theme === 'dark');
  }
}
