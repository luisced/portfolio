const root = document.documentElement;
const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');

function syncButtons() {
  for (const button of buttons) button.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', root.dataset.theme === 'dark' ? '#20221e' : '#f1f0e9');
}

function applyTheme(theme: 'light' | 'dark') {
  root.dataset.theme = theme;
  try { localStorage.setItem('theme', theme); } catch {}
  syncButtons();
}

function toggleTheme(origin: { x: number; y: number }) {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduceMotion) {
    applyTheme(next);
    return;
  }
  const endRadius = Math.hypot(
    Math.max(origin.x, innerWidth - origin.x),
    Math.max(origin.y, innerHeight - origin.y),
  );
  const transition = document.startViewTransition(() => applyTheme(next));
  transition.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${endRadius}px at ${origin.x}px ${origin.y}px)`] },
      { duration: 640, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' },
    );
  });
}

function originFromButton(button: HTMLButtonElement) {
  const rect = button.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

syncButtons();
for (const button of buttons) {
  button.addEventListener('click', () => toggleTheme(originFromButton(button)));
}
addEventListener('keydown', (event) => {
  if (event.altKey && event.key.toLowerCase() === 't' && !event.metaKey && !event.ctrlKey) {
    event.preventDefault();
    const button = buttons[0];
    toggleTheme(button ? originFromButton(button) : { x: innerWidth / 2, y: 0 });
  }
});
