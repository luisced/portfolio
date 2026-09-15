/**
 * Theme toggle + bench light. Loaded once from Base.astro.
 * The no-flash theme *read* is inline in <head>; this file only handles changes.
 */
const root = document.documentElement;
const KEY = 'theme';

function apply(theme: 'dark' | 'light') {
  root.dataset.theme = theme;
  localStorage.setItem(KEY, theme);
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
    btn.setAttribute('aria-pressed', String(theme === 'light'));
  }
}

for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
  btn.setAttribute('aria-pressed', String(root.dataset.theme === 'light'));
  btn.addEventListener('click', () => {
    apply(root.dataset.theme === 'light' ? 'dark' : 'light');
  });
}

// Alt+T keyboard shortcut (carried from V2).
addEventListener('keydown', (e) => {
  if (e.altKey && e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    apply(root.dataset.theme === 'light' ? 'dark' : 'light');
  }
});

// The lamp is the pointer. Hatched shadows (.object::before) fall away from it:
// --shadow-dx/dy are the offset, clamped so objects never look detached.
if (
  matchMedia('(hover: hover) and (pointer: fine)').matches &&
  matchMedia('(prefers-reduced-motion: no-preference)').matches
) {
  let tx = 10;
  let ty = 12;
  let cx = tx;
  let cy = ty;
  let raf = 0;

  const tick = () => {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    root.style.setProperty('--shadow-dx', `${cx.toFixed(1)}px`);
    root.style.setProperty('--shadow-dy', `${cy.toFixed(1)}px`);
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.1 ? requestAnimationFrame(tick) : 0;
  };

  addEventListener(
    'pointermove',
    (e) => {
      // Lamp at the pointer → shadow points the other way. ±16px range.
      tx = ((0.5 - e.clientX / innerWidth) * 32).toFixed(1) as unknown as number;
      ty = 6 + (0.5 - e.clientY / innerHeight) * 20;
      if (!raf) raf = requestAnimationFrame(tick);
    },
    { passive: true },
  );
}
