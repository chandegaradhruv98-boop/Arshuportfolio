import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import CollectionModal from '../components/CollectionModal';
import useCol from '../hooks/useCol';
import useWhere from '../hooks/useWhere';
import { img } from '../lib/img';

const cats = ['All', 'Designs', 'Sketches', 'Moodboards', 'Details'];

export default function Work() {
  const { content: c } = useSite();
  const collections = useWhere('collections', 'status', 'Published');
  const media = useCol('media');
  const [tab, setTab] = useState('All');
  const [openCol, setOpenCol] = useState(null);
  const [view, setView] = useState(null);
  const shown = tab === 'All' ? media : media.filter((m) => m.category === tab);
  const procSmall = (c.processImages || []).slice(0, 3);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView(), 150);
    else window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <p className="eyebrow text-ink/60">All work</p>
      <h1 className="font-display font-light text-5xl mt-3">Collections &amp; portfolio</h1>

      <h2 className="font-display text-3xl mt-12 mb-5">Collections</h2>
      {collections.length === 0 && <p className="text-sm text-ink/50">No collections published yet.</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {collections.map((col) => (
          <button key={col.id} onClick={() => setOpenCol(col)} className="text-left group">
            <div className="aspect-[3/4] bg-ink/10 overflow-hidden">
              {col.coverUrl && <img src={img(col.coverUrl, 600)} alt={col.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />}
            </div>
            <p className="mt-2 text-[11px] uppercase tracking-[0.2em]">{col.name}</p>
            <p className="text-xs text-ink/50">{col.category}</p>
          </button>
        ))}
      </div>

      <h2 id="process" className="font-display text-3xl mt-16 mb-2">{c.processTitle}</h2>
      <p className="text-sm text-ink/70 max-w-xl">{c.processText}</p>
      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[c.processImage, ...procSmall].filter(Boolean).map((u) => (
          <img key={u} src={img(u, 600)} alt="" className="w-full aspect-[3/4] object-cover" loading="lazy" />
        ))}
      </div>

      <h2 className="font-display text-3xl mt-16 mb-4">Portfolio</h2>
      <div className="flex flex-wrap gap-2 mb-5">
        {cats.map((k) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] border ${tab === k ? 'bg-ink text-white border-ink' : 'border-ink/25 hover:bg-ink/5'}`}>{k}</button>
        ))}
      </div>
      {shown.length === 0 && <p className="text-sm text-ink/50">Nothing here yet.</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {shown.map((m) => (
          <button key={m.id} onClick={() => setView(m.url)}>
            <img src={img(m.url, 500)} alt="" className="w-full aspect-[3/4] object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {openCol && <CollectionModal c={openCol} onClose={() => setOpenCol(null)} />}
      {view && (
        <div className="fixed inset-0 z-50 bg-black/85 grid place-items-center p-4" onClick={() => setView(null)}>
          <button className="absolute top-4 right-4 text-white icon-btn" aria-label="Close"><X /></button>
          <img src={img(view, 1600)} alt="" className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </div>
  );
}
