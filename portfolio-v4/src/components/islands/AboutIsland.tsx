/** About: portrait resolves from grayscale to color pixel by pixel; counters settle on scroll. */
import PixelTransition from '@/components/reactbits/PixelTransition/PixelTransition';
import CountUp from '@/components/reactbits/CountUp/CountUp';

interface Stat {
  to: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

interface Props {
  portrait: string;
  portraitAlt: string;
  stats: Stat[];
}

export default function AboutIsland({ portrait, portraitAlt, stats }: Props) {
  return (
    <div className="about__stage">
      <figure className="about__portrait" data-cursor-target>
        <PixelTransition
          firstContent={<img className="about__img about__img--mono" src={portrait} alt={portraitAlt} loading="lazy" decoding="async" />}
          secondContent={<img className="about__img" src={portrait} alt="" loading="lazy" decoding="async" />}
          gridSize={12}
          pixelColor="#c8ff00"
          animationStepDuration={0.4}
          aspectRatio="125%"
          className="about__pixels"
        />
      </figure>

      <ul className="about__stats">
        {stats.map((s) => (
          <li key={s.label}>
            <span className="about__stat display">
              {s.prefix}
              <CountUp to={s.to} from={0} duration={1.6} separator="," />
              {s.suffix}
            </span>
            <span className="label">{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
