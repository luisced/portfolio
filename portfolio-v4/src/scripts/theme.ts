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

// Bench light follows the pointer, gently, only on fine pointers with motion allowed.
if (
  matchMedia('(hover: hover) and (pointer: fine)').matches &&
  matchMedia('(prefers-reduced-motion: no-preference)').matches
) {
  let tx = 62;
  let ty = 28;
  let cx = tx;
  let cy = ty;
  let raf = 0;

  const tick = () => {
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    root.style.setProperty('--light-x', `${cx.toFixed(2)}%`);
    root.style.setProperty('--light-y', `${cy.toFixed(2)}%`);
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.05 ? requestAnimationFrame(tick) : 0;
  };

  addEventListener(
    'pointermove',
    (e) => {
      tx = (e.clientX / innerWidth) * 100;
      ty = (e.clientY / innerHeight) * 100;
      if (!raf) raf = requestAnimationFrame(tick);
    },
    { passive: true },
  );
}
