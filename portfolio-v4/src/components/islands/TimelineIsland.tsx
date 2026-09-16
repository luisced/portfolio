/** Timeline: milestones stack on top of each other as you scroll (React Bits ScrollStack, native scroll). */
import ScrollStack, { ScrollStackItem } from '@/components/reactbits/ScrollStack/ScrollStack';

export interface Milestone {
  index: string;
  range: string;
  role: string;
  org: string;
  location: string;
  highlights: string[];
  tags: string[];
  accent: string;
}

export default function TimelineIsland({ items }: { items: Milestone[] }) {
  return (
    <ScrollStack useWindowScroll itemDistance={80} itemScale={0.035} itemStackDistance={28} stackPosition="18%" scaleEndPosition="8%" baseScale={0.86} className="timeline__stack">
      {items.map((m) => (
        <ScrollStackItem key={m.index} itemClassName="milestone">
          <div className="milestone__head">
            <span className="milestone__index display stroke">{m.index}</span>
            <span className="label milestone__range" style={{ color: m.accent }}>
              {m.range}
            </span>
          </div>
          <h3 className="milestone__role display">{m.role}</h3>
          <p className="milestone__org">
            {m.org} <span className="milestone__loc">· {m.location}</span>
          </p>
          <ul className="milestone__list">
            {m.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <ul className="milestone__tags">
            {m.tags.map((tg) => (
              <li className="chip" key={tg}>
                {tg}
              </li>
            ))}
          </ul>
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
}
