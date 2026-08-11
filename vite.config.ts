import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { federation } from '@module-federation/vite';
import { rmfNavJson } from './vite-plugin-rmf-nav-json';

// The client-only Angular build does not emit the plugin's default SSR entry.
function omitUnavailableSsrEntry(stats: Record<string, unknown>) {
  const metaData = stats.metaData;

  if (typeof metaData !== 'object' || metaData === null) {
    return stats;
  }

  const clientMetaData = Object.fromEntries(
    Object.entries(metaData).filter(([key]) => key !== 'ssrRemoteEntry'),
  );

  return {
    ...stats,
    metaData: clientMetaData,
  };
}

// Federation remote for the React shell. Dev/preview on 5002
// (shell 5000, React remote 5001). CORS enabled so the shell can load remoteEntry.
export default defineConfig({
  plugins: [
    angular(),
    federation({
      name: 'runtime_mf_module_angular',
      filename: 'remoteEntry.js',
      manifest: {
        additionalData: ({ stats }) => omitUnavailableSsrEntry(stats),
      },
      dts: false,
      shared: {},
      exposes: {
        './mount': './src/app/entry/index.ts',
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
  optimizeDeps: {
    // Angular and Federation virtual entries discover these after Vite's
    // initial scan. Keep optimizer metadata stable across dev-server restarts.
    noDiscovery: true,
    include: ['rxjs', 'rxjs/operators', '@module-federation/runtime'],
  },
  build: {
    target: 'esnext',
  },
});
