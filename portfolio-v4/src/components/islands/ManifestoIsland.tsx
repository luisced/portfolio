/** Manifesto: the quote floats in per character with the scroll (React Bits ScrollFloat). */
import ScrollFloat from '@/components/reactbits/ScrollFloat/ScrollFloat';

export default function ManifestoIsland({ text }: { text: string }) {
  return (
    <ScrollFloat
      animationDuration={1.1}
      ease="back.inOut(2)"
      scrollStart="center bottom+=40%"
      scrollEnd="bottom bottom-=30%"
      stagger={0.02}
      containerClassName="manifesto__float"
      textClassName="manifesto__text display"
    >
      {text}
    </ScrollFloat>
  );
}
