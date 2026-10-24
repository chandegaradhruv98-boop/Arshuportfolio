import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { useSite } from '../context/SiteContext';
import { useToast } from '../components/Toast';
import CollectionModal from '../components/CollectionModal';
import AboutStrip from '../components/AboutStrip';
import useCol from '../hooks/useCol';
import useWhere from '../hooks/useWhere';
import { img } from '../lib/img';

function duration(e) {
  const total = (Number(e.years) || 0) * 12 + (Number(e.months) || 0);
  const y = Math.floor(total / 12);
  const m = total % 12;
  const parts = [];
  if (y) parts.push(`${y} ${y === 1 ? 'year' : 'years'}`);
  if (m || !y) parts.push(`${m} ${m === 1 ? 'month' : 'months'}`);
  return parts.join(' ');
}

function ContactForm() {
  const toast = useToast();
  const empty = { name: '', email: '', subject: '', message: '', website: '' };
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (f.website) return; // hidden spam trap
    setBusy(true);
    try {
      await addDoc(collection(db, 'messages'), {
        name: f.name.trim(), email: f.email.trim(), subject: f.subject.trim(), message: f.message.trim(),
        status: 'New', createdAt: serverTimestamp(),
      });
      toast('Message sent. Thank you!', 'success');
      setF(empty);
    } catch { toast('Could not send. Please try again.', 'error'); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input className="field" placeholder="Your name" value={f.name} onChange={set('name')} required maxLength={100} />
        <input className="field" type="email" placeholder="Email" value={f.email} onChange={set('email')} required maxLength={200} />
      </div>
      <input className="field" placeholder="Subject (e.g. custom outfit)" value={f.subject} onChange={set('subject')} maxLength={200} />
      <textarea className="field" rows={4} placeholder="Your message" value={f.message} onChange={set('message')} required maxLength={2000} />
      <input className="hidden" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} aria-hidden="true" />
      <button className="btn-primary w-fit px-8" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}

export default function Home() {
  const { content: c } = useSite();
  const collections = useWhere('collections', 'status', 'Published');
  const media = useCol('media');
  const experiences = useCol('experiences');
  const projects = useCol('projects');
  const [open, setOpen] = useState(null);

  const heroSrc = c.heroImage || c.heroImages?.[0];
  const cards = collections.slice(0, 3);
  const featured = (media.some((m) => m.featured) ? media.filter((m) => m.featured) : media).slice(0, 6);
  const tags = c.processTags.split(',').map((t) => t.trim()).filter(Boolean);
  const procSmall = (c.processImages || []).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100svh] md:min-h-[92vh] flex items-center text-white bg-espresso">
        {heroSrc && <img src={img(heroSrc, 1800)} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '70% 25%' }} />}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/5" />
        <div className="relative max-w-6xl mx-auto px-6 w-full pt-24 pb-16">
          <p className="eyebrow">{c.heroEyebrow}</p>
          <h1 className="font-display font-light uppercase tracking-[0.06em] leading-[1.1] text-4xl sm:text-5xl md:text-6xl mt-5 max-w-xl">{c.heroTitle}</h1>
          <p className="mt-6 max-w-sm text-sm sm:text-base text-white/90 leading-relaxed">{c.heroSubtitle}</p>
          <a href="#portfolio" className="mt-8 inline-flex items-center gap-8 border border-white/80 px-6 py-3 text-[11px] uppercase tracking-[0.25em] hover:bg-white hover:text-ink transition">
            {c.heroButton} <ArrowRight size={14} />
          </a>
        </div>
        <a href="#collections" className="hidden md:flex absolute right-10 bottom-14 flex-col items-center gap-3 text-[10px] tracking-[0.3em] uppercase" aria-label="Scroll down">
          Scroll <span className="block h-12 w-px bg-white/80" />
        </a>
      </section>

      {/* COLLECTIONS */}
      <section id="collections" className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-[300px_1fr] gap-12 items-center">
        <div>
          <p className="eyebrow text-ink/60">{c.collectionsEyebrow}</p>
          <h2 className="font-display font-light text-5xl leading-[1.05] mt-4">{c.collectionsTitle}</h2>
          <span className="block w-4 h-px bg-ink mt-5" />
          <p className="mt-5 text-sm text-ink/75 leading-relaxed whitespace-pre-line">{c.collectionsText}</p>
          <Link to="/work" className="link-arrow mt-8">Explore collections <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {cards.length === 0 && [0, 1, 2].map((i) => (
            <div key={i} className="aspect-[3/4.2] bg-ink/10 grid place-items-center text-center text-xs text-ink/50 px-4">Add collections in Admin → Collections</div>
          ))}
          {cards.map((col) => (
            <button key={col.id} onClick={() => setOpen(col)} className="group relative aspect-[3/4.2] overflow-hidden bg-ink/10 text-left">
              {col.coverUrl && <img src={img(col.coverUrl, 700)} alt={col.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute left-3 bottom-3 text-white text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">{col.name} <ArrowRight size={13} /></span>
            </button>
          ))}
        </div>
      </section>

      {/* DESIGN PROCESS */}
      <section id="process" className="bg-[#EEE6DF] border-y border-sand">
        <div className="grid md:grid-cols-[1fr_1fr_1.25fr] items-stretch">
          <div className="min-h-[220px] bg-ink/10">
            {c.processImage && <img src={img(c.processImage, 900)} alt="Design sketches" className="w-full h-full object-cover" loading="lazy" />}
          </div>
          <div className="px-8 py-12 flex flex-col justify-center">
            <p className="eyebrow text-ink/60 text-[10px]">{c.processEyebrow}</p>
            <h2 className="font-display font-light text-4xl leading-tight mt-3">{c.processTitle}</h2>
            <p className="mt-4 text-sm text-ink/75 leading-relaxed">{c.processText}</p>
            {tags.length > 0 && <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-ink/70">{tags.join('  /  ')}</p>}
            <Link to="/work#process" className="link-arrow mt-6 w-fit">View process <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-3 gap-3 p-4 md:p-6 items-center">
            {(procSmall.length ? procSmall : [null, null, null]).map((u, i) => (
              <div key={u || i} className="aspect-[3/4] bg-ink/10 overflow-hidden">
                {u && <img src={img(u, 500)} alt="" className="w-full h-full object-cover" loading="lazy" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section id="portfolio" className="max-w-6xl mx-auto px-6 pt-16">
        <p className="eyebrow text-ink/60 text-[10px]">Featured work</p>
        <div className="mt-4 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {featured.length === 0 && Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-ink/10" />)}
            {featured.map((m) => (
              <img key={m.id} src={img(m.url, 500)} alt="" className="w-full aspect-[3/4] object-cover" loading="lazy" />
            ))}
          </div>
          <Link to="/work" className="link-arrow w-fit">View all work <ArrowRight size={14} /></Link>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="max-w-3xl mx-auto px-6 pt-24">
        <p className="eyebrow text-ink/60 text-[10px]">Career</p>
        <h2 className="font-display font-light text-4xl mt-3 mb-8">Experience</h2>
        {experiences.length === 0 && <p className="text-ink/50 text-sm">No experience added yet.</p>}
        <ol className="border-l border-gold pl-6 space-y-8">
          {experiences.map((e) => (
            <li key={e.id} className="relative">
              <span className="absolute -left-[31px] top-2 h-2.5 w-2.5 rounded-full bg-accent" />
              <h3 className="font-display text-2xl">{e.role}</h3>
              <p className="text-ink/80">{e.company}</p>
              <p className="text-sm text-ink/60 mt-1">{duration(e)} · Currently working: {e.current ? 'Yes' : 'No'}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="max-w-6xl mx-auto px-6 pt-24">
        <p className="eyebrow text-ink/60 text-[10px]">Selected</p>
        <h2 className="font-display font-light text-4xl mt-3 mb-8">Projects</h2>
        {projects.length === 0 && <p className="text-ink/50 text-sm">No projects added yet.</p>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <article key={p.id}>
              <div className="aspect-[4/5] bg-ink/10 overflow-hidden">
                {p.imageUrl && <img src={img(p.imageUrl, 700)} alt={p.title} className="w-full h-full object-cover" loading="lazy" />}
              </div>
              <h3 className="font-display text-2xl mt-3">{p.title}</h3>
              <p className="text-sm text-ink/70">{p.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-[300px_1fr] gap-10">
        <div>
          <p className="eyebrow text-ink/60 text-[10px]">Contact</p>
          <h2 className="font-display font-light text-4xl mt-3 leading-tight">Let’s create something together</h2>
          <p className="mt-4 text-sm text-ink/70">Custom outfits, collaborations and commissions — send a message and I will reply soon.</p>
        </div>
        <ContactForm />
      </section>

      <AboutStrip />
      {open && <CollectionModal c={open} onClose={() => setOpen(null)} />}
    </>
  );
}
