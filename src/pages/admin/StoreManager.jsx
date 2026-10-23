
import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Trash2 } from 'lucide-react';
import { db } from '../../firebase';
import { useToast } from '../../components/Toast';
import useCol from '../../hooks/useCol';
import { uploadImage } from '../../lib/upload';

export default function StoreManager() {
  const toast = useToast();
  const outfits = useCol('outfits');
  const [f, setF] = useState({ name: '', description: '', price: '' });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  const add = async (e) => {
    e.preventDefault();
    if (!file) return toast('Choose an outfit image.', 'error');
    setBusy(true);
    try {
      const imageUrl = await uploadImage(file, 'outfits');
      await addDoc(collection(db, 'outfits'), { ...f, price: Number(f.price), imageUrl, likedBy: [], createdAt: serverTimestamp() });
      setF({ name: '', description: '', price: '' }); setFile(null); e.target.reset();
      toast('Outfit published', 'success');
    } catch (ex) { toast(ex.message || 'Could not publish.', 'error'); }
    finally { setBusy(false); }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="font-display text-4xl mb-4">Store</h2>
      <form onSubmit={add} className="bg-white border border-ink/10 p-4 grid grid-cols-2 gap-3">
        <input className="field" placeholder="Outfit name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
        <input className="field" type="number" min="0" placeholder="Price (₹)" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} required />
        <textarea className="field col-span-2" rows={3} placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} required />
        <input className="col-span-2 text-sm" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn-primary col-span-2" disabled={busy}>{busy ? 'Publishing…' : 'Publish outfit'}</button>
      </form>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {outfits.map((o) => (
          <div key={o.id} className="bg-white border border-ink/10">
            <img src={o.imageUrl} alt={o.name} className="aspect-[4/5] w-full object-cover" />
            <div className="p-3 space-y-2">
              <p className="font-display text-xl">{o.name}</p>
              <input className="field" type="number" defaultValue={o.price} onBlur={(x) => updateDoc(doc(db, 'outfits', o.id), { price: Number(x.target.value) })} aria-label="Price" />
              <button className="btn-ghost w-full" onClick={() => window.confirm('Delete this outfit?') && deleteDoc(doc(db, 'outfits', o.id))}><Trash2 size={16} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
