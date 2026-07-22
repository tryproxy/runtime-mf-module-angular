import type { NavManifest } from '@platform/runtime-mf-contract';

/** Single source for Angular remote pages (routes + nav.json emit). */
export const angularNavManifest = {
  contractVersion: 1,
  moduleId: 'remoteAngular',
  pages: [
    {
      id: 'overview',
      segment: '',
      label: { en: 'Overview', ru: 'Обзор' },
    },
    {
      id: 'about',
      segment: 'about',
      label: { en: 'About', ru: 'О модуле' },
    },
  ],
} as const satisfies NavManifest;

export type AngularNavPageId = (typeof angularNavManifest.pages)[number]['id'];
