/** Scroll-velocity marquee (React Bits) with the site's mono voice. */
import ScrollVelocity from '@/components/reactbits/ScrollVelocity/ScrollVelocity';

interface Props {
  texts: string[];
  velocity?: number;
  className?: string;
  size?: 'sm' | 'lg';
}

export default function Velocity({ texts, velocity = 60, className = '', size = 'sm' }: Props) {
  // One line; items separated by a mark. ScrollVelocity repeats the row.
  const row = texts.map((t) => `${t}  ✕  `).join('');
  return (
    <div className={`velocity velocity--${size} ${className}`}>
      <ScrollVelocity texts={[row]} velocity={velocity} numCopies={4} className="velocity__row" />
    </div>
  );
}
