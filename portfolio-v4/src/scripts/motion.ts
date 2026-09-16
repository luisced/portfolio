/**
 * The single motion entry point. Base.astro imports this module only when
 * `prefers-reduced-motion: no-preference` — under reduced motion no JS from this
 * file (nor GSAP) is ever fetched. Without JS, everything renders complete.
 *
 * Declarative hooks any section may use:
 *   data-reveal                 fade/rise once when entering the viewport
 *   data-reveal-group           stagger direct children marked data-reveal
 *   data-parallax="0.15"        translateY by (scroll progress * factor * 100px)
 *
 * Section-level choreography lives in React islands (src/components/islands) that own their
 * own GSAP timelines; this module only handles the declarative hooks above.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 0.7 });

export { gsap, ScrollTrigger };

/* Reveal: IntersectionObserver is enough; no GSAP timeline needed. */
const groups = document.querySelectorAll<HTMLElement>('[data-reveal-group]');
for (const group of groups) {
  let i = 0;
  for (const child of group.querySelectorAll<HTMLElement>(':scope > [data-reveal]')) {
    child.style.setProperty('--reveal-delay', `${Math.min(i, 8) * 70}ms`);
    i++;
  }
}

const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    }
  },
  { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
);
for (const el of document.querySelectorAll('[data-reveal]')) io.observe(el);

/* Parallax: cheap scrubbed translate for decorative layers only. */
for (const el of document.querySelectorAll<HTMLElement>('[data-parallax]')) {
  const factor = Number(el.dataset.parallax ?? '0.15');
  gsap.to(el, {
    y: () => -factor * 100,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
  });
}

/* Horizontal scrub: the camera tracks along the bench. Percentage of the element's width. */
for (const el of document.querySelectorAll<HTMLElement>('[data-parallax-x]')) {
  const factor = Number(el.dataset.parallaxX ?? '0.1');
  gsap.fromTo(
    el,
    { xPercent: factor * 50 },
    {
      xPercent: -factor * 50,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  );
}
