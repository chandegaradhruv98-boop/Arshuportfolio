import { ArrowRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import SocialLinks from './SocialLinks';

export default function AboutStrip() {
  const { content: c } = useSite();
  return (
    <section id="about" className="bg-espresso text-white">
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-[220px_1fr_auto] gap-8 md:gap-14 items-center">
        <div>
          <p className="eyebrow text-white/70">About me</p>
          <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight font-light">{c.aboutTitle}</h2>
        </div>
        <div className="max-w-md">
          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{c.aboutText}</p>
          <a href="/#contact" className="link-arrow mt-6">Learn more <ArrowRight size={14} /></a>
        </div>
        <SocialLinks />
      </div>
      <p className="text-center text-[11px] tracking-[0.25em] uppercase text-white/40 pb-6">© {new Date().getFullYear()} {c.siteName}</p>
    </section>
  );
}
