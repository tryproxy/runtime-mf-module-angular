import type { AppLocale } from '../entry/remote-contract';

export interface CardCopy {
  title: string;
  body: string;
  themeLabel: string;
}

const messages: Record<AppLocale, CardCopy> = {
  en: {
    title: 'Angular remote',
    body: 'HostBridge theme and locale reach this card from the shell.',
    themeLabel: 'Theme',
  },
  ru: {
    title: 'Angular remote',
    body: 'Тема и локаль HostBridge доходят до этой карточки из shell.',
    themeLabel: 'Тема',
  },
};

export function getCardCopy(locale: AppLocale): CardCopy {
  return messages[locale] ?? messages.en;
}
