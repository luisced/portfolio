/**
 * Hero: the name as two pressure-reactive lines over an interactive dot grid.
 * Both lines size against the longer word, so the short one justifies across the full width.
 * SSR renders the letters (LCP-safe text); the grid canvas and pointer physics mount on the client
 * only when motion is welcome (client:media in Hero.astro) — otherwise the static letters stay.
 */
import DotGrid from '@/components/reactbits/DotGrid/DotGrid';
import TextPressure from '@/components/reactbits/TextPressure/TextPressure';

interface Props {
  first: string;
  last: string;
}

export default function HeroIsland({ first, last }: Props) {
  const longest = first.length >= last.length ? first : last;
  const common = { fontFamily: "'Mona Sans Variable'", width: true, weight: true, italic: false, flex: true, stroke: false, textColor: 'var(--fg)', minFontSize: 40, fitText: longest };
  return (
    <div className="hero-stage">
      <div className="hero-stage__grid" aria-hidden="true">
        <DotGrid dotSize={2} gap={22} baseColor="#2a2a2a" activeColor="#c8ff00" proximity={140} shockRadius={220} shockStrength={4} resistance={600} returnDuration={1.2} />
      </div>
      <h1 className="hero-stage__type" aria-label={`${first} ${last}`}>
        <span className="hero-stage__line">
          <TextPressure as="span" text={first} {...common} />
        </span>
        <span className="hero-stage__line hero-stage__line--acid">
          <TextPressure as="span" text={last} {...common} textColor="var(--acid)" />
        </span>
      </h1>
    </div>
  );
}
