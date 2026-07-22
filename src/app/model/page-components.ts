import type { Type } from '@angular/core';
import { AboutPage } from '../features/about/about-page';
import { OverviewPage } from '../features/overview/overview-page';
import type { AngularNavPageId } from '../model/nav-manifest';

/** Page id → component. Keep in sync with `angularNavManifest.pages`. */
export const angularPageComponents = {
  overview: OverviewPage,
  about: AboutPage,
} as const satisfies Record<AngularNavPageId, Type<unknown>>;

export function angularPageComponent(pageId: AngularNavPageId): Type<unknown> {
  return angularPageComponents[pageId];
}
