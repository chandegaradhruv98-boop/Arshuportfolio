import { useEffect } from 'react';

// Admin pages always render with a 1280px wide "desktop" layout, even on a phone.
export default function useDesktopViewport() {
  useEffect(() => {
    const m = document.querySelector('meta[name=viewport]');
    if (!m) return;
    const old = m.getAttribute('content');
    m.setAttribute('content', 'width=1280');
    return () => m.setAttribute('content', old);
  }, []);
}
