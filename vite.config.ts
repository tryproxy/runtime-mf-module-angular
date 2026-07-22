import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import federation from '@originjs/vite-plugin-federation';
import { rmfNavJson } from './vite-plugin-rmf-nav-json';

// Federation remote for the React shell (@originjs). Dev/preview on 5002
// (shell 5000, React remote 5001). CORS enabled so the shell can load remoteEntry.
export default defineConfig({
  plugins: [
    angular(),
    federation({
      name: 'runtime_mf_module_angular',
      filename: 'remoteEntry.js',
      exposes: {
        './mount': './src/app/entry/mount.ts',
      },
      shared: [],
    }),
    rmfNavJson(),
  ],
  server: {
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
