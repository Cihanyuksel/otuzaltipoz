import { useEffect, RefObject, useCallback } from 'react';

/**
 * Hook that handles clicks outside of the passed ref
 * @param ref - React ref object attached to the element
 * @param callback - Function to call when clicking outside
 * @param isActive - Optional flag to enable/disable the listener (default: true)
 */
export function useOutsideClick<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  callback: () => void,
  isActive: boolean = true
) {
  // Memoize the callback to prevent unnecessary re-renders
  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    },
    [ref, callback]
  );

  useEffect(() => {
    if (!isActive) {
      return;
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handleClickOutside, isActive]);
}