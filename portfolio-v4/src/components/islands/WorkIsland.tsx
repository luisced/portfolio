/**
 * Work chapter: pinned horizontal scroll through the featured projects (GSAP ScrollTrigger).
 * Each panel: outlined counter, glitch title, pixel-transition artifact, outcome, stack, magnetic CTA.
 * ≤ md or reduced motion: panels stack vertically, nothing pins.
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlitchText from '@/components/reactbits/GlitchText/GlitchText';
import PixelTransition from '@/components/reactbits/PixelTransition/PixelTransition';
import Magnet from '@/components/reactbits/Magnet/Magnet';

gsap.registerPlugin(ScrollTrigger);

export interface WorkPanel {
  href: string;
  title: string;
  role: string;
  outcome: string;
  category: string;
  stack: string[];
  cover: string;
  coverAlt: string;
}

interface Props {
  panels: WorkPanel[];
  labels: { view: string; role: string; stack: string; outcome: string };
}

export default function WorkIsland({ panels, labels }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const tr = track.current;
    if (!el || !tr) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 48em) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => tr.scrollWidth - el.clientWidth;
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (st) => {
            if (bar.current) bar.current.style.transform = `scaleX(${st.progress})`;
          },
        },
      });
      return () => tween.scrollTrigger?.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <div className="work" ref={wrap}>
      <div className="work__progress" aria-hidden="true">
        <div className="work__bar" ref={bar} />
      </div>
      <div className="work__track" ref={track}>
        {panels.map((p, i) => (
          <article className="panel" key={p.href} data-index={i}>
            <div className="panel__head">
              <span className="panel__num display stroke" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="label panel__cat">{p.category}</span>
            </div>

            <h3 className="panel__title">
              <a href={p.href} data-cursor-target>
                <GlitchText speed={0.6} enableShadows enableOnHover className="panel__glitch">
                  {p.title}
                </GlitchText>
              </a>
            </h3>

            <div className="panel__body">
              <a className="panel__art" href={p.href} aria-label={`${labels.view}: ${p.title}`} data-cursor-target>
                <PixelTransition
                  firstContent={<img src={p.cover} alt={p.coverAlt} loading="lazy" decoding="async" />}
                  secondContent={
                    <div className="panel__art-alt">
                      <span className="label">{labels.outcome}</span>
                      <p>{p.outcome}</p>
                    </div>
                  }
                  gridSize={14}
                  pixelColor="#c8ff00"
                  animationStepDuration={0.35}
                  aspectRatio="66%"
                  className="panel__pixels"
                />
              </a>

              <div className="panel__copy">
                <p className="panel__outcome">{p.outcome}</p>
                <dl className="panel__spec">
                  <div>
                    <dt className="label">{labels.role}</dt>
                    <dd>{p.role}</dd>
                  </div>
                  <div>
                    <dt className="label">{labels.stack}</dt>
                    <dd className="panel__stack">
                      {p.stack.map((s) => (
                        <span className="chip" key={s}>
                          {s}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
                <Magnet padding={40} magnetStrength={6} wrapperClassName="panel__magnet">
                  <a className="btn btn--acid" href={p.href} data-cursor-target>
                    {labels.view} →
                  </a>
                </Magnet>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
