/**
 * Global chrome that only makes sense on a fine pointer with motion allowed
 * (mounted via client:media): the target cursor and the film grain.
 */
import { useEffect } from 'react';
import TargetCursor from '@/components/reactbits/TargetCursor/TargetCursor';
import Noise from '@/components/reactbits/Noise/Noise';

export default function Chrome() {
  useEffect(() => {
    document.documentElement.classList.add('has-cursor');
    return () => document.documentElement.classList.remove('has-cursor');
  }, []);

  return (
    <>
      <TargetCursor targetSelector="a, button, [data-cursor-target]" spinDuration={3} hideDefaultCursor={false} parallaxOn={false} />
      <div className="grain" aria-hidden="true">
        <Noise patternSize={240} patternScaleX={1} patternScaleY={1} patternRefreshInterval={3} patternAlpha={12} />
      </div>
    </>
  );
}
