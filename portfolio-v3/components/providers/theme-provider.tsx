'use client';

import { useEffect, useState } from 'react';

export function ThemeProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
    root.lang = locale;
    setMounted(true);
  }, [locale]);

  return mounted ? <>{children}</> : null;
}
