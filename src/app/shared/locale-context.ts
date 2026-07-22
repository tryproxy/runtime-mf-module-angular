import { Injectable, signal } from '@angular/core';
import type { AppLocale } from '@platform/runtime-mf-contract';

@Injectable()
export class LocaleContext {
  public readonly locale = signal<AppLocale>('en');
}
