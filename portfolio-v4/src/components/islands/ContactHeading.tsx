/** Contact heading: scrambles under the pointer (React Bits ScrambledText). */
import ScrambledText from '@/components/reactbits/ScrambledText/ScrambledText';

export default function ContactHeading({ text }: { text: string }) {
  return (
    <ScrambledText radius={120} duration={1.1} speed={0.5} scrambleChars="/\\_#%&*+" className="contact__scramble display">
      {text}
    </ScrambledText>
  );
}
