import type { Routes } from '@angular/router';
import { angularNavManifest } from './model/nav-manifest';
import { angularPageComponent } from './model/page-components';

/** Routes projected from the same manifest as `nav.json` + embedded pages. */
export const appRoutes: Routes = [
  ...angularNavManifest.pages.map(page => ({
    path: page.segment,
    component: angularPageComponent(page.id),
  })),
  { path: '**', redirectTo: angularNavManifest.pages[0]?.segment ?? '' },
];
