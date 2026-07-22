import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { appRoutes } from './app.routes';
import { HOST_BRIDGE } from './shared/host-bridge.token';
import { LocaleContext } from './shared/locale-context';
import { ThemeContext } from './shared/theme-context';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(appRoutes),
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: HOST_BRIDGE, useValue: null },
        ThemeContext,
        LocaleContext,
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('should render overview bridge demo card', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h1');

    expect(heading).not.toBeNull();
    expect(heading?.textContent).toContain('Angular remote');
    expect(compiled.textContent).toContain('locale: en');
    expect(compiled.textContent).toContain('Theme: dark');
  });
});
