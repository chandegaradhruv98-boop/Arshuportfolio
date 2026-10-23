
import { ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import useCol from '../hooks/useCol';

export default function Home() {
  const { content: c } = useSite();
  const nav = useNavigate();
  const experiences = useCol('experiences');
  const projects = useCol('projects');
  const slots = c.heroImages.length ? c.heroImages.slice(0, 3) : [null, null];

  return (
    <>
      {/* Hero + About */}
      <section id="about" className="max-w-6xl mx-auto px-4 pt-14 pb-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] font-semibold">{c.heroTitle}</h1>
          <p className="mt-5 text-lg text-ink/80 max-w-md">{c.heroSubtitle}</p>
          <p className="mt-6 text-ink/70 max-w-md leading-relaxed whitespace-pre-line">{c.aboutText}</p>
          <div className="mt-8 flex gap-3">
            <button className="btn-primary" onClick={() => nav('/shop')}>Shop outfits</button>
            <a className="btn-ghost" href="#projects"><ArrowDown size={16} /> See my work</a>
          </div>
        </div>

        {/* Arch frames: a jharokha-style motif for the hero images */}
        <div className="flex gap-4 justify-center items-start">
          {slots.map((src, i) => (
            <div key={i}
              className={`flex-1 max-w-[210px] aspect-[3/5] rounded-t-full overflow-hidden border border-gold bg-ink/10 ${i % 2 ? 'mt-14' : ''}`}>
              {src
                ? <img src={src} alt="Indo-Western outfit" className="w-full h-full object-cover" />
                : <div className="w-full h-full grid place-items-center text-center text-xs text-ink/50 px-4">Hero image — add from the admin panel</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="max-w-3xl mx-auto px-4 pt-20">
        <h2 className="font-display text-4xl mb-8">Experience</h2>
        {experiences.length === 0 && <p className="text-ink/50">No experience added yet.</p>}
        <ol className="border-l border-gold pl-6 space-y-8">
          {experiences.map((e) => (
            <li key={e.id} className="relative">
              <span className="absolute -left-[31px] top-2 h-2.5 w-2.5 rounded-full bg-accent" />
              <h3 className="font-display text-2xl">{e.role}</h3>
              <p className="text-ink/80">{e.company}</p>
              <p className="text-sm text-ink/60 mt-1">
                {e.months} {Number(e.months) === 1 ? 'month' : 'months'} · Currently working: {e.current ? 'Yes' : 'No'}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Projects */}
      <section id="projects" className="max-w-6xl mx-auto px-4 pt-20">
        <h2 className="font-display text-4xl mb-8">Projects</h2>
        {projects.length === 0 && <p className="text-ink/50">No projects added yet.</p>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <article key={p.id}>
              <div className="aspect-[4/5] bg-ink/10 overflow-hidden">
                {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />}
              </div>
              <h3 className="font-display text-2xl mt-3">{p.title}</h3>
              <p className="text-sm text-ink/70">{p.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
