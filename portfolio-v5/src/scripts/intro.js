// The greeting: when the camera reaches the monitor, the word writes itself by hand and the three lines type out beneath it.
const film = document.getElementById('film'), boot = document.getElementById('boot');
if (boot) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lines = [...boot.querySelectorAll('.who p')], texts = lines.map((p) => p.textContent);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function type() {
    for (const [i, p] of lines.entries()) {
      p.classList.add('typing');
      for (const ch of texts[i]) { p.textContent += ch; await wait(24); }
      await wait(260);
      p.classList.remove('typing');
    }
    boot.classList.add('done');
  }
  if (reduced) boot.classList.add('go', 'done');
  else {
    lines.forEach((p) => { p.textContent = ''; });
    const start = () => { boot.classList.add('go'); setTimeout(type, +boot.dataset.ms * 0.82); };
    /* the viewer shows the monitor's content when its chapter arrives: that is the cue */
    const arrived = () => boot.style.visibility === 'visible' && +boot.style.opacity > 0.6;
    if (arrived()) start();
    else new MutationObserver((_, o) => { if (arrived()) { o.disconnect(); start(); } }).observe(boot, { attributes: true, attributeFilter: ['style'] });
  }
}
