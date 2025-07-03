import { useLayoutEffect } from 'react';

export const useLockBodyScroll = (locked: boolean) => {
  useLayoutEffect(() => {
    const originalStyle = document.body.style.overflow;
    if (locked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalStyle;
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [locked]);
};
