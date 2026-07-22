import type { Routes } from '@angular/router';
import { AboutPage } from './features/about/about-page';
import { OverviewPage } from './features/overview/overview-page';

export const appRoutes: Routes = [
  { path: '', component: OverviewPage },
  { path: 'about', component: AboutPage },
  { path: '**', redirectTo: '' },
];
