/**
 * Scroll-velocity marquee on GSAP (replaces React Bits' ScrollVelocity, which needed `motion`).
 * Base drift + a boost proportional to scroll velocity; direction follows the scroll.
 * SSR renders the row once, so the text is readable before/without hydration.
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  texts: string[];
  velocity?: number;
  className?: string;
  size?: 'sm' | 'lg';
}

const COPIES = 4;

export default function Velocity({ texts, velocity = 60, className = '', size = 'sm' }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const row = texts.map((t) => `${t}  ✕  `).join('');

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return;

    let x = 0;
    let scrollV = 0;
    let dir = 1;
    const width = () => first.offsetWidth;
    const wrap = gsap.utils.wrap(-width(), 0);

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity();
        scrollV = v;
        if (Math.abs(v) > 5) dir = v > 0 ? 1 : -1;
      },
    });

    const tick = (_time: number, dt: number) => {
      const boost = Math.min(Math.abs(scrollV) / 1000, 5);
      x -= dir * (velocity + velocity * boost) * (dt / 1000);
      scrollV *= 0.9;
      el.style.transform = `translate3d(${wrap(x)}px, 0, 0)`;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, [velocity]);

  return (
    <div className={`velocity velocity--${size} ${className}`} aria-hidden="true">
      <div className="velocity__track" ref={track}>
        {Array.from({ length: COPIES }, (_, i) => (
          <span className="velocity__row" key={i}>
            {row}
          </span>
        ))}
      </div>
    </div>
  );
}
