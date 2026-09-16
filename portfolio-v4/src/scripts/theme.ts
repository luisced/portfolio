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

// Scroll position readout in the control strip (000–100).
const pct = document.querySelector<HTMLElement>('[data-scroll-pct]');
// Past the hero, the fixed mark gets out of the way of chapter titles (see base.css .scrolled).
const onScroll = () => root.classList.toggle('scrolled', scrollY > 160);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (pct) {
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    pct.textContent = String(Math.round((scrollY / Math.max(1, max)) * 100)).padStart(3, '0');
  };
  addEventListener('scroll', update, { passive: true });
  update();
}
