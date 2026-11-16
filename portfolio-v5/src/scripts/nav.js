// The top bar's shortcuts: each one flies the camera to its chapter by scrolling the story there. On narrow screens they live in a menu.
const track = document.getElementById('track'), kids = [...track.children], N = kids.length;
const menu = document.getElementById('menu'), burger = document.getElementById('burger');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const links = [...document.querySelectorAll('[data-go]')];
/* chapter number → its #name, read from the links themselves */
const KEYS = Object.fromEntries(links.filter((a) => +a.dataset.go > 0).map((a) => [+a.dataset.go, a.getAttribute('href').slice(1)]));
const STOPS = Object.keys(KEYS).map(Number).sort((a, b) => b - a);

/* closing plays the curtain going back up before the dialog actually closes */
let closing = 0;
function shut() {
  if (!menu.open || closing) return;
  if (reduced) return menu.close();
  menu.classList.add('closing');
  closing = setTimeout(() => { closing = 0; menu.classList.remove('closing'); menu.close(); }, 250);
}

/* where chapter b rests: a little past its start, inside the stretch where the camera holds still */
function top(b) {
  if (b <= 0) return 0;
  if (b >= N - 1) return document.documentElement.scrollHeight;
  let y = 0;
  for (let i = 0; i < b; i++) y += kids[i].offsetHeight;
  return y + kids[b].offsetHeight * 0.18;
}
function go(b, instant) {
  scrollTo({ top: top(b), behavior: instant || reduced ? 'auto' : 'smooth' });
}
function chapter() {
  let y = scrollY, i = 0;
  for (; i < N - 1 && y >= kids[i].offsetHeight * 0.92; i++) y -= kids[i].offsetHeight;
  return i;
}
/* the shortcut of the part on screen is marked */
const part = (c) => STOPS.find((b) => c >= b) || 0;
let current = -1;
function mark() {
  const p = part(chapter());
  if (p === current) return;
  current = p;
  for (const a of links) {
    const b = +a.dataset.go;
    if (b === p && p > 0) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    a.classList.toggle('seen', b > 0 && b < p); /* lo ya recorrido */
  }
}
addEventListener('scroll', mark, { passive: true });
mark();

for (const a of links)
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const b = +a.dataset.go;
    shut();
    go(b);
    history.replaceState(null, '', b ? '#' + KEYS[b] : location.pathname + location.search);
  });

/* arriving with #work in the address (from a case study's "back", or a shared link) lands on that chapter */
const fromHash = Object.keys(KEYS).find((b) => '#' + KEYS[b] === location.hash);
if (fromHash) {
  /* the browser would otherwise put the page back where it was last time, after we have moved it */
  history.scrollRestoration = 'manual';
  const land = () => { go(+fromHash, true); mark(); };
  if (document.readyState === 'complete') land(); else addEventListener('load', land, { once: true });
  setTimeout(land, 400);
}

burger.addEventListener('click', () => { document.documentElement.classList.add('locked'); menu.showModal(); });
menu.addEventListener('click', (e) => { if (e.target === menu || e.target.closest('[data-close]') || e.target.closest('.more a:not([data-open])')) shut(); });
menu.addEventListener('cancel', (e) => { e.preventDefault(); shut(); }); /* Escape closes with the same exit */
menu.addEventListener('close', () => { clearTimeout(closing); closing = 0; menu.classList.remove('closing'); if (!document.getElementById('detail').open) document.documentElement.classList.remove('locked'); });
