import { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const defaults = {
  siteName: 'Arshu Studio',
  logoUrl: '',
  heroTitle: 'Indo-Western fashion, cut for today',
  heroSubtitle: 'Handcrafted silhouettes that carry heritage into modern wardrobes.',
  aboutText: 'I am a fashion designer blending traditional Indian craft with contemporary tailoring.',
  heroImages: [],
  accentColor: '#8A2A5B',
  fontFamily: 'Cormorant Garamond',
  contact: { instagram: '', linkedin: '', email: '' },
};

const SiteCtx = createContext({ content: defaults, ready: false });
export const useSite = () => useContext(SiteCtx);

export function SiteProvider({ children }) {
  const [content, setContent] = useState(defaults);
  const [ready, setReady] = useState(false);

  useEffect(
    () => onSnapshot(doc(db, 'site', 'content'), (snap) => {
      const d = snap.exists() ? snap.data() : {};
      setContent({ ...defaults, ...d, contact: { ...defaults.contact, ...(d.contact || {}) } });
      setReady(true);
    }, () => setReady(true)),
    []
  );

  // Apply admin-chosen accent colour + font site-wide
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', content.accentColor);
    document.documentElement.style.setProperty('--font', `'${content.fontFamily}'`);
    document.title = content.siteName;
  }, [content.accentColor, content.fontFamily, content.siteName]);

  return <SiteCtx.Provider value={{ content, ready }}>{children}</SiteCtx.Provider>;
}
