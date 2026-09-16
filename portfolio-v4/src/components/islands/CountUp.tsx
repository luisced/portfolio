/**
 * Counter on GSAP (replaces React Bits' CountUp, which needed `motion`).
 * Server-renders the final value; when hydrated and scrolled into view it counts up once.
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Props {
  to: number;
  from?: number;
  duration?: number;
  separator?: string;
  className?: string;
}

export default function CountUp({ to, from = 0, duration = 1.6, separator = ',', className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) => Math.round(n).toLocaleString('en-US').replace(/,/g, separator);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const state = { v: from };
        gsap.to(state, {
          v: to,
          duration,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = format(state.v);
          },
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, from, duration, separator]);

  return (
    <span className={className} ref={ref}>
      {format(to)}
    </span>
  );
}
