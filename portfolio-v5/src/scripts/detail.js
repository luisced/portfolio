// Taking an object off the bookshelf: its picture travels from the shelf to the middle of the screen and opens into a card.
const dialog = document.getElementById('detail');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let source = null;

function open(button) {
  const article = dialog.querySelector(`article[data-id="${button.dataset.open}"]`);
  if (!article) return;
  dialog.querySelectorAll('article').forEach((a) => { a.hidden = a !== article; });
  /* una zona invisible sobre un trofeo abre desde su placa */
  const origin = button.matches('.hit') ? document.querySelector(`.award[data-open="${button.dataset.open}"]`) || button : button;
  const from = (origin.querySelector('img') || origin).getBoundingClientRect();
  source = origin;
  /* con la ficha abierta la página de atrás no se mueve: ni con la rueda, ni con el teclado, ni arrastrando en táctil */
  document.documentElement.classList.add('locked');
  dialog.showModal();
  dialog.scrollTop = 0;
  const plain = 'plain' in button.dataset; /* un enlace de texto (escríbeme): abre la ficha sin sacar nada del cuarto */
  if (!plain) origin.classList.add('out');
  const picture = plain ? null : article.querySelector('img'), to = picture ? picture.getBoundingClientRect() : { width: 0 };
  if (!reduced && !picture) article.querySelector('.copy').animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.23, 1, .32, 1)' });
  if (!reduced && to.width > 0) {
    /* from where it stood on the shelf to where it rests in the card */
    picture.animate(
      [{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})` }, { transform: 'none' }],
      { duration: 460, easing: 'cubic-bezier(.23, 1, .32, 1)' },
    ).effect.target.style.transformOrigin = '0 0';
    article.querySelector('.copy').animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 320, delay: 140, easing: 'cubic-bezier(.23, 1, .32, 1)', fill: 'backwards' });
  }
}

document.querySelectorAll('[data-open]').forEach((button) => {
  button.addEventListener('click', (e) => { e.preventDefault(); const menu = document.getElementById('menu'); if (menu && menu.open) menu.close(); open(button); });
  /* apuntar a un trofeo o a su placa resalta a los dos */
  const pair = [...document.querySelectorAll(`[data-open="${button.dataset.open}"]`)];
  const hot = (on) => pair.forEach((el) => el.classList.toggle('hot', on));
  button.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hot(true); }); /* un dedo no apunta: sin esto el resalte se queda pegado tras tocar */
  button.addEventListener('pointerleave', () => hot(false));
});
dialog.addEventListener('click', (e) => { if (e.target === dialog || e.target.closest('[data-close]')) dialog.close(); });
dialog.addEventListener('close', () => { document.documentElement.classList.remove('locked'); if (source) { source.classList.remove('out'); source.focus({ preventScroll: true }); source = null; } });
