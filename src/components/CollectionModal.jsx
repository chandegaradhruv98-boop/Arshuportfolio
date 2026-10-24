import { X } from 'lucide-react';
import { img } from '../lib/img';

export default function CollectionModal({ c, onClose }) {
  const pics = [c.coverUrl, ...(c.gallery || [])].filter(Boolean);
  return (
    <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto" onClick={onClose}>
      <div className="max-w-4xl mx-auto my-8 bg-paper p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start">
          <div>
            <p className="eyebrow text-ink/60">{c.category}</p>
            <h3 className="font-display text-4xl font-light mt-1">{c.name}</h3>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        {c.description && <p className="mt-3 text-sm text-ink/70 whitespace-pre-line max-w-xl">{c.description}</p>}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          {pics.map((u) => <img key={u} src={img(u, 900)} alt={c.name} className="w-full aspect-[3/4] object-cover" loading="lazy" />)}
        </div>
      </div>
    </div>
  );
}
