/**
 * Timeline rail. Contract (owned by the Timeline section agent):
 *   [data-timeline]                 section wrapper
 *   [data-timeline-track]           horizontally translating track (desktop ≥ --lg only)
 *   [data-timeline-item]            each milestone; gets `aria-current="step"` when active
 *   [data-timeline-cursor]          the tool cursor that moves along the rail
 *
 * Rules from PLAN.md §9 Phase 3: pin distance ≤ 2 viewports, native scroll only,
 * keyboard ← → moves between milestones at any time, ≤ --md renders a vertical
 * list with no pinning (this module then only wires keyboard focus).
 */
import { gsap, ScrollTrigger } from './motion';

const section = document.querySelector<HTMLElement>('[data-timeline]');
if (section) {
  const items = [...section.querySelectorAll<HTMLElement>('[data-timeline-item]')];
  const track = section.querySelector<HTMLElement>('[data-timeline-track]');
  const cursor = section.querySelector<HTMLElement>('[data-timeline-cursor]');
  let active = 0;

  const setActive = (i: number) => {
    active = Math.max(0, Math.min(items.length - 1, i));
    items.forEach((it, idx) => {
      if (idx === active) it.setAttribute('aria-current', 'step');
      else it.removeAttribute('aria-current');
    });
    if (cursor) cursor.style.setProperty('--at', String(active / Math.max(1, items.length - 1)));
  };

  section.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(active + 1);
      items[active]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(active - 1);
      items[active]?.focus();
    }
  });
  items.forEach((it, i) => it.addEventListener('focus', () => setActive(i)));
  setActive(0);

  const desktop = matchMedia('(width >= 64em)');
  if (track && desktop.matches) {
    const distance = () => track.scrollWidth - section.clientWidth;
    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.min(distance(), innerHeight * 2)}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (st) => setActive(Math.round(st.progress * (items.length - 1))),
      },
    });
  }
}

export { ScrollTrigger };
