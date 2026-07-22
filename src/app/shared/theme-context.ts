import { Injectable, signal } from '@angular/core';
import type { ThemeMode } from '@platform/runtime-mf-contract';

@Injectable()
export class ThemeContext {
  public readonly mode = signal<ThemeMode>('dark');
}
