import type { AppLocale } from '@platform/runtime-mf-contract';

export interface CardCopy {
  title: string;
  body: string;
  themeLabel: string;
  meHint: string;
  meRequest: string;
  meLoading: string;
  meNoBridge: string;
  meNoBearer: string;
  meNoToken: string;
  meFailed: string;
}

const messages: Record<AppLocale, CardCopy> = {
  en: {
    title: 'Angular remote',
    body: 'HostBridge theme and locale reach this card from the shell.',
    themeLabel: 'Theme',
    meHint: 'Protected GET /v1/account/me via bridge.auth.http.getAccessToken().',
    meRequest: 'Request /v1/account/me',
    meLoading: 'Loading…',
    meNoBridge: 'No HostBridge (open inside the shell).',
    meNoBearer: 'auth.http is not bearer mode.',
    meNoToken: 'No access token from shell (sign in via /login).',
    meFailed: 'Failed to load /v1/account/me',
  },
  ru: {
    title: 'Angular remote',
    body: 'Тема и локаль HostBridge доходят до этой карточки из shell.',
    themeLabel: 'Тема',
    meHint: 'Защищённый GET /v1/account/me через bridge.auth.http.getAccessToken().',
    meRequest: 'Запросить /v1/account/me',
    meLoading: 'Загрузка…',
    meNoBridge: 'Нет HostBridge (откройте внутри shell).',
    meNoBearer: 'auth.http не в режиме bearer.',
    meNoToken: 'Нет access token от shell (войдите через /login).',
    meFailed: 'Не удалось загрузить /v1/account/me',
  },
  es: {
    title: 'Angular remote',
    body: 'El tema y el locale de HostBridge llegan a esta tarjeta desde el shell.',
    themeLabel: 'Tema',
    meHint: 'GET protegido /v1/account/me vía bridge.auth.http.getAccessToken().',
    meRequest: 'Solicitar /v1/account/me',
    meLoading: 'Cargando…',
    meNoBridge: 'Sin HostBridge (ábrelo dentro del shell).',
    meNoBearer: 'auth.http no está en modo bearer.',
    meNoToken: 'Sin access token del shell (inicia sesión en /login).',
    meFailed: 'No se pudo cargar /v1/account/me',
  },
};

export function getCardCopy(locale: AppLocale): CardCopy {
  return messages[locale] ?? messages.en;
}
