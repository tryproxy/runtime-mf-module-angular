import './styles.css';
import { mount } from './app/entry/mount';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Missing #root container');
}

// Standalone Vite entry (pnpm dev). Shell uses federation expose ./mount instead.
mount({
  container,
  basename: '/',
  bridge: {
    theme: {
      getSnapshot: () => ({ mode: 'light' }),
      subscribe: () => () => undefined,
    },
    i18n: {
      getLocale: () => 'en',
      subscribe: () => () => undefined,
    },
    auth: {
      getSession: () => null,
    },
    navigation: {
      getLocation: () => ({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
      }),
      navigate: path => {
        window.history.pushState(null, '', path);
      },
      replace: path => {
        window.history.replaceState(null, '', path);
      },
    },
    telemetry: {
      track: () => undefined,
      captureException: () => undefined,
      captureMessage: () => undefined,
    },
  },
});
