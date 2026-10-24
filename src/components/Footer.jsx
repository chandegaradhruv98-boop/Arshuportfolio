import { Instagram, Linkedin, Mail } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function Footer() {
  const { content: c } = useSite();
  const { instagram, linkedin, email } = c.contact;
  const link = 'flex items-center gap-2 hover:text-gold transition';
  return (
    <footer id="contact" className="bg-ink text-white mt-24">
      <div className="max-w-6xl mx-auto px-4 py-14 flex flex-col md:flex-row gap-8 md:items-end justify-between">
        <div>
          <h2 className="font-display text-4xl">Let’s work together</h2>
          <p className="text-white/70 mt-2">Commissions, collaborations and custom outfits.</p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          {instagram && <a className={link} href={instagram} target="_blank" rel="noreferrer"><Instagram size={18} /> Instagram</a>}
          {linkedin && <a className={link} href={linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} /> LinkedIn</a>}
          {email && <a className={link} href={`mailto:${email}`}><Mail size={18} /> {email}</a>}
          {!instagram && !linkedin && !email && <span className="text-white/50">Contact details coming soon.</span>}
        </div>
      </div>
      <p className="text-center text-xs text-white/40 pb-6">© {new Date().getFullYear()} {c.siteName}</p>
    </footer>
  );
}
