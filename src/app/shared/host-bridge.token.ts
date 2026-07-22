import { InjectionToken } from '@angular/core';
import type { HostBridge } from '@platform/runtime-mf-contract';

export const HOST_BRIDGE = new InjectionToken<HostBridge | null>('HOST_BRIDGE');
