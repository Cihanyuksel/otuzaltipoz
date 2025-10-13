import { useEffect, RefObject } from 'react';

/**
 * Hook that handles clicks outside of the passed ref
 * @param ref - React ref object attached to the element
 * @param callback - Function to call when clicking outside
 * @param isActive - Optional flag to enable/disable the listener (default: true)
 */
function useOutsideClick<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  callback: () => void,
  isActive: boolean = true
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    if (isActive) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback, isActive]);
}

export default useOutsideClick;