'use client';

import { useEffect, useState, useRef } from 'react';

interface DecryptedTextProps {
  targetText: string;
  speed?: number;
  className?: string;
  glyphs?: string;
}

export default function DecryptedText({
  targetText,
  speed = 8,
  className = '',
  glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(targetText);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let iteration = 0;
    const targetLength = targetText.length;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (iteration >= targetLength) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setDisplayText(targetText);
        return;
      }

      setDisplayText(
        targetText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return targetText[index];
            }
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join('')
      );

      iteration += 1;
    }, 1000 / speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetText, speed, glyphs]);

  return <span className={className}>{displayText}</span>;
}

