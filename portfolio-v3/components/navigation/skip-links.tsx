'use client';

import { useTranslations } from 'next-intl';

export function SkipLinks() {
  const t = useTranslations('navigation');

  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      >
        {t('skipToContent')}
      </a>
    </div>
  );
}
