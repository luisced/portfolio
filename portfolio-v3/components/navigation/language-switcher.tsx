'use client';

import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { locales, type Locale } from '@/i18n/config';
import { useRouter, usePathname } from '@/i18n/navigation';

const localeNames: Record<string, string> = {
  en: 'EN',
  es: 'ES',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1">
      <Globe className="size-4 text-muted-foreground" />
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={cn(
            'px-2 py-1 text-xs font-medium rounded transition-colors cursor-pointer',
            locale === loc
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
          aria-label={`Switch to ${localeNames[loc]}`}
          aria-current={locale === loc ? 'true' : undefined}
        >
          {localeNames[loc]}
        </button>
      ))}
    </div>
  );
}
