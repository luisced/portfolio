import { useEffect, useCallback } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface KeyboardOptions {
  /**
   * Whether the keyboard shortcuts should be active
   * @default true
   */
  enabled?: boolean;
  
  /**
   * Whether to prevent default browser behavior when a key is pressed
   * @default false
   */
  preventDefault?: boolean;
  
  /**
   * Whether to stop event propagation when a key is pressed
   * @default false
   */
  stopPropagation?: boolean;
}

/**
 * Custom hook for handling keyboard shortcuts
 * 
 * @param keyMap - Object mapping key combinations to handler functions
 * @param options - Configuration options
 * @returns void
 * 
 * @example
 * ```tsx
 * useKeyboard({
 *   'Escape': () => setModalOpen(false),
 *   'ArrowLeft': () => previousSlide(),
 *   'ArrowRight': () => nextSlide(),
 *   'Shift+N': () => navigateToNextPage(),
 * });
 * ```
 */
const useKeyboard = (
  keyMap: Record<string, KeyHandler>,
  options: KeyboardOptions = {}
): void => {
  const { 
    enabled = true, 
    preventDefault = false, 
    stopPropagation = false 
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Create key signature (e.g., "Shift+A")
      const keySignature = [
        event.ctrlKey ? 'Ctrl' : '',
        event.altKey ? 'Alt' : '',
        event.shiftKey ? 'Shift' : '',
        event.metaKey ? 'Meta' : '',
        event.key
      ]
        .filter(Boolean)
        .join('+')
        .replace('++', '+'); // Fix double + if key is "+"

      // Check if we have a handler for this key combination
      const handler = keyMap[keySignature] || keyMap[event.key];
      
      if (handler) {
        if (preventDefault) {
          event.preventDefault();
        }
        
        if (stopPropagation) {
          event.stopPropagation();
        }
        
        handler(event);
      }
    },
    [keyMap, enabled, preventDefault, stopPropagation]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
};

export default useKeyboard;
