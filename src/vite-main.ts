import './styles.css';
import { createMockHostBridge } from '@platform/runtime-mf-contract';
import { mount } from './app/entry/mount';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Missing #root container');
}

// Standalone Vite entry (pnpm dev). Shell uses federation expose ./mount instead.
mount({
  container,
  basename: '/',
  bridge: createMockHostBridge({ theme: 'light', locale: 'en' }),
});
