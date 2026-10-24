import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Star, Trash2, Upload } from 'lucide-react';
import { db } from '../../firebase';
import { useToast } from '../../components/Toast';
import useCol from '../../hooks/useCol';
import { uploadImage } from '../../lib/upload';
import { img } from '../../lib/img';
import { PageHeader } from '../../components/admin/ui';

const cats = ['Designs', 'Sketches', 'Moodboards', 'Details'];

export default function MediaManager() {
  const media = useCol('media');
  const toast = useToast();
  const [tab, setTab] = useState('All');
  const [cat, setCat] = useState('Designs');
  const [busy, setBusy] = useState(false);
  const shown = tab === 'All' ? media : media.filter((m) => m.category === tab);

  const upload = async (files) => {
    setBusy(true);
    let ok = 0;
    for (const f of Array.from(files)) {
      try {
        const url = await uploadImage(f, 'media');
        await addDoc(collection(db, 'media'), { url, category: cat, featured: false, createdAt: serverTimestamp() });
        ok++;
      } catch (e) { toast(e.message, 'error'); }
    }
    setBusy(false);
    if (ok) toast(`${ok} image${ok > 1 ? 's' : ''} uploaded`, 'success');
  };

  return (
    <div>
      <PageHeader title="Portfolio / Media Gallery" subtitle="Manage your design images, sketches, moodboards and details. Star an image to show it in “Featured Work” on the home page (first 6)."
        action={
          <div className="flex items-center gap-2">
            <select className="field w-40" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category for new uploads">
              {cats.map((c) => <option key={c}>{c}</option>)}
            </select>
            <label className="btn-primary cursor-pointer">
              <Upload size={16} /> {busy ? 'Uploading…' : 'Upload Media'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
            </label>
          </div>
        } />
      <div className="flex gap-2 mb-5">
        {['All', ...cats].map((k) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-1.5 rounded text-sm ${tab === k ? 'bg-accent text-white' : 'bg-white border border-ink/15'}`}>{k}</button>
        ))}
      </div>
      {shown.length === 0 && <p className="text-sm text-ink/50">No images here yet. Choose a category and click “Upload Media”.</p>}
      <div className="grid grid-cols-5 gap-3">
        {shown.map((m) => (
          <div key={m.id} className="relative group">
            <img src={img(m.url, 400)} alt="" className="w-full aspect-[3/4] object-cover rounded" />
            <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 rounded">{m.category}</span>
            <div className="absolute top-1 right-1 flex gap-1">
              <button className={`p-1.5 rounded-full ${m.featured ? 'bg-amber-400 text-white' : 'bg-white/90'}`} aria-label="Feature"
                onClick={() => updateDoc(doc(db, 'media', m.id), { featured: !m.featured })}><Star size={14} fill={m.featured ? 'currentColor' : 'none'} /></button>
              <button className="p-1.5 rounded-full bg-white/90" aria-label="Delete"
                onClick={() => window.confirm('Delete this image?') && deleteDoc(doc(db, 'media', m.id))}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
