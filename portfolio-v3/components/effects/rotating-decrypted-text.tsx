'use client';

import { useState, useEffect } from 'react';
import DecryptedText from '@/components/ui/decrypted-text';

interface RotatingDecryptedTextProps {
  phrases: string[];
  intervalMs?: number;
  speed?: number;
  className?: string;
}

export default function RotatingDecryptedText({
  phrases,
  intervalMs = 3000,
  speed = 8,
  className = '',
}: RotatingDecryptedTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (phrases.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [phrases.length, intervalMs]);

  return (
    <DecryptedText
      targetText={phrases[currentIndex]}
      speed={speed}
      className={className}
    />
  );
}

