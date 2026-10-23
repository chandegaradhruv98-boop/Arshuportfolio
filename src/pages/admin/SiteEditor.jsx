import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { X } from 'lucide-react';
import { db } from '../../firebase';
import { useSite } from '../../context/SiteContext';
import { useToast } from '../../components/Toast';
import { uploadImage } from '../../lib/upload';

const fonts = ['Cormorant Garamond', 'Playfair Display', 'Montserrat', 'Poppins'];

export default function SiteEditor() {
  const { content, ready } = useSite();
  const toast = useToast();
  const [f, setF] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (ready && !f) setF(content); }, [ready]);
  if (!f) return <p>Loading…</p>;

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const upload = async (file, done) => {
    if (!file) return;
    setBusy(true);
    try { done(await uploadImage(file, 'site')); }
    catch (e) { toast(e.message, 'error'); }
    finally { setBusy(false); }
  };

  const save = async () => {
    const { contact, ...rest } = f; // contact links are edited in their own tab
    try { await setDoc(doc(db, 'site', 'content'), rest, { merge: true }); toast('Website updated', 'success'); }
    catch { toast('Could not save changes.', 'error'); }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <h2 className="font-display text-4xl">Website</h2>
      <label className="block text-sm">Brand / company name<input className="field mt-1" value={f.siteName} onChange={set('siteName')} /></label>

      <div>
        <p className="text-sm mb-1">Logo</p>
        <div className="flex items-center gap-4">
          {f.logoUrl && <img src={f.logoUrl} alt="" className="h-12 w-12 object-contain border" />}
          <input type="file" accept="image/*" onChange={(e) => upload(e.target.files[0], (url) => setF({ ...f, logoUrl: url }))} />
        </div>
      </div>

      <label className="block text-sm">Hero headline<input className="field mt-1" value={f.heroTitle} onChange={set('heroTitle')} /></label>
      <label className="block text-sm">Hero sub-headline<input className="field mt-1" value={f.heroSubtitle} onChange={set('heroSubtitle')} /></label>
      <label className="block text-sm">About me<textarea rows={5} className="field mt-1" value={f.aboutText} onChange={set('aboutText')} /></label>

      <div>
        <p className="text-sm mb-1">Hero images (the first 3 are shown)</p>
        <div className="flex flex-wrap gap-3 mb-2">
          {f.heroImages.map((u, i) => (
            <div key={u} className="relative">
              <img src={u} alt="" className="h-24 w-16 object-cover rounded-t-full border" />
              <button className="absolute -top-2 -right-2 bg-white border rounded-full p-0.5" aria-label="Remove image"
                onClick={() => setF({ ...f, heroImages: f.heroImages.filter((_, j) => j !== i) })}><X size={14} /></button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" onChange={(e) => upload(e.target.files[0], (url) => setF({ ...f, heroImages: [...f.heroImages, url] }))} />
      </div>

      <div className="flex gap-6">
        <label className="text-sm">Font
          <select className="field mt-1" value={f.fontFamily} onChange={set('fontFamily')}>
            {fonts.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
        <label className="text-sm">Accent colour
          <input type="color" className="block mt-1 h-10 w-20" value={f.accentColor} onChange={set('accentColor')} />
        </label>
      </div>

      <button className="btn-primary" onClick={save} disabled={busy}>{busy ? 'Uploading…' : 'Save changes'}</button>
    </div>
  );
}
