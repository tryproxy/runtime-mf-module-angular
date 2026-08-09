import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { federation } from '@module-federation/vite';
import { rmfNavJson } from './vite-plugin-rmf-nav-json';

// Federation remote for the React shell. Dev/preview on 5002
// (shell 5000, React remote 5001). CORS enabled so the shell can load remoteEntry.
export default defineConfig({
  plugins: [
    angular(),
    federation({
      name: 'runtime_mf_module_angular',
      filename: 'remoteEntry.js',
      manifest: true,
      dts: false,
      shared: {},
      disableShared: true,
      exposes: {
        './mount': './src/app/entry/mount.ts',
      },
    }),
    rmfNavJson(),
  ],
  server: {
    origin: 'http://localhost:5002',
    port: 5002,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 5002,
    strictPort: true,
    cors: true,
  },
  build: {
    target: 'esnext',
  },
});
