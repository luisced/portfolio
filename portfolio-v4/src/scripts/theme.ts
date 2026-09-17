const root = document.documentElement;
const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
function syncButtons() {
  for (const button of buttons) button.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', root.dataset.theme === 'dark' ? '#20221e' : '#f1f0e9');
}
function toggleTheme() {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch {}
  syncButtons();
}
syncButtons();
for (const button of buttons) button.addEventListener('click', toggleTheme);
addEventListener('keydown', (event) => {
  if (event.altKey && event.key.toLowerCase() === 't' && !event.metaKey && !event.ctrlKey) {
    event.preventDefault();
    toggleTheme();
  }
});
