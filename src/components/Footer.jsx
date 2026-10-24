import { useSite } from '../context/SiteContext';
import SocialLinks from './SocialLinks';

// Slim footer for inner pages (the home page has its own About strip)
export default function Footer() {
  const { content: c } = useSite();
  return (
    <footer className="bg-espresso text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-5">
        <p className="text-[11px] tracking-[0.25em] uppercase text-white/60">© {new Date().getFullYear()} {c.siteName}</p>
        <SocialLinks size={18} />
      </div>
    </footer>
  );
}
