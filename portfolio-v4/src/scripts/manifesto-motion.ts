/**
 * Manifesto: words are pre-split server-side into <span data-word>.
 * We scrub a single CSS variable (--progress 0..1) on the container;
 * CSS paints each word based on its --i index. No DOM churn, no innerHTML.
 * Owned by the Manifesto section agent; keep the contract above.
 */
import { gsap, ScrollTrigger } from './motion';

for (const el of document.querySelectorAll<HTMLElement>('[data-manifesto]')) {
  const words = el.querySelectorAll<HTMLElement>('[data-word]');
  words.forEach((w, i) => w.style.setProperty('--i', String(i / Math.max(1, words.length - 1))));
  gsap.fromTo(
    el,
    { '--progress': 0 },
    {
      '--progress': 1,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 75%',
        end: 'bottom 45%',
        scrub: 0.4,
      },
    },
  );
}

export { ScrollTrigger };
