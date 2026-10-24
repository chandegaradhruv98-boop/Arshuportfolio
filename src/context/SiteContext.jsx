import { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const defaults = {
  siteName: 'Arshu Studio',
  logoUrl: '',
  tagline: 'Fashion Designer',
  heroEyebrow: "Hello, I'm a",
  heroTitle: 'Fashion Designer & Creative Artist',
  heroSubtitle: 'Blending tradition with modernity through contemporary silhouettes and timeless craft.',
  heroButton: 'View my work',
  heroImage: '',
  heroImages: [],
  collectionsEyebrow: 'My collections',
  collectionsTitle: 'Indo Western Fusion',
  collectionsText: 'Rooted in culture, designed for today.\nMy Indo-western collection brings together the elegance of Indian heritage and the freedom of modern fashion.',
  processEyebrow: 'My design process',
  processTitle: 'From Inspiration to Creation',
  processText: 'Every collection starts with a feeling — a story, a culture, a colour, or a moment.',
  processTags: 'Sketches, Mood boards, Fabrics, Final looks',
  processImage: '',
  processImages: [],
  aboutTitle: 'Designing Dreams',
  aboutText: 'I am a fashion designer with a deep love for Indian heritage, modern aesthetics and storytelling through clothing. My work is an experiment between tradition and innovation, where every garment tells a unique story.',
  accentColor: '#8A5A44',
  fontFamily: 'Cormorant Garamond',
  contact: { instagram: '', pinterest: '', linkedin: '', email: '' },
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

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', content.accentColor);
    document.documentElement.style.setProperty('--font', `'${content.fontFamily}'`);
    document.title = content.siteName;
  }, [content.accentColor, content.fontFamily, content.siteName]);

  return <SiteCtx.Provider value={{ content, ready }}>{children}</SiteCtx.Provider>;
}
