// Native scrolling owns the narrative. Observation only updates chapter navigation;
// all content remains visible and usable without JavaScript or animation support.
const chapters = document.querySelectorAll<HTMLElement>('[data-chapter]');
const chapterLinks = document.querySelectorAll<HTMLAnchorElement>('[data-chapter-link]');
if ('IntersectionObserver' in window) {
  const chapterObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of chapterLinks) {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-15% 0px -55% 0px' });
  chapters.forEach((chapter) => chapterObserver.observe(chapter));
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: .12 });
  document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));
}
