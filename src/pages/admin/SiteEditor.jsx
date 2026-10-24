import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useSite } from '../../context/SiteContext';
import { useToast } from '../../components/Toast';
import { Card, ImageInput, MultiImageInput, PageHeader } from '../../components/admin/ui';

const fonts = ['Cormorant Garamond', 'Playfair Display', 'Montserrat', 'Poppins'];

export default function SiteEditor() {
  const { content, ready } = useSite();
  const toast = useToast();
  const [f, setF] = useState(null);

  useEffect(() => { if (ready && !f) setF({ ...content, heroImage: content.heroImage || content.heroImages?.[0] || '' }); }, [ready]);
  if (!f) return <p>Loading…</p>;

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const text = (k, label, rows) => (
    <label className="block text-sm">{label}
      {rows ? <textarea rows={rows} className="field mt-1" value={f[k] || ''} onChange={set(k)} /> : <input className="field mt-1" value={f[k] || ''} onChange={set(k)} />}
    </label>
  );

  const save = async () => {
    const { contact, ...rest } = f; // contact links are saved from the Settings tab
    try { await setDoc(doc(db, 'site', 'content'), rest, { merge: true }); toast('Website updated', 'success'); }
    catch { toast('Could not save changes.', 'error'); }
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <PageHeader title="Website" subtitle="Edit the text and photos of your home page. Click “Save changes” at the bottom."
        action={<button className="btn-primary" onClick={save}>Save changes</button>} />

      <Card className="p-5 space-y-4">
        <h3 className="font-display text-2xl">Brand</h3>
        <div className="grid grid-cols-2 gap-4">{text('siteName', 'Brand / company name')}{text('tagline', 'Small text next to the logo')}</div>
        <div><p className="text-sm mb-2">Logo</p><ImageInput value={f.logoUrl} onChange={(u) => setF({ ...f, logoUrl: u })} className="h-28 w-28" label="Upload logo" /></div>
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-display text-2xl">Hero (top of the page)</h3>
        <div className="grid grid-cols-2 gap-4">{text('heroEyebrow', 'Small line above heading')}{text('heroButton', 'Button text')}</div>
        {text('heroTitle', 'Heading')}
        {text('heroSubtitle', 'Sub-heading', 2)}
        <div><p className="text-sm mb-2">Hero photo (wide photo, model on the right works best)</p><ImageInput value={f.heroImage} onChange={(u) => setF({ ...f, heroImage: u })} className="h-52" label="Upload hero photo" /></div>
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-display text-2xl">Collections section</h3>
        <div className="grid grid-cols-2 gap-4">{text('collectionsEyebrow', 'Small label')}{text('collectionsTitle', 'Title')}</div>
        {text('collectionsText', 'Text', 4)}
        <p className="text-xs text-ink/50">The 3 photo cards come from Admin → Collections (first 3 published).</p>
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-display text-2xl">Design process</h3>
        <div className="grid grid-cols-2 gap-4">{text('processEyebrow', 'Small label')}{text('processTitle', 'Title')}</div>
        {text('processText', 'Text', 3)}
        {text('processTags', 'Tags (separate with commas)')}
        <div><p className="text-sm mb-2">Large photo (sketches)</p><ImageInput value={f.processImage} onChange={(u) => setF({ ...f, processImage: u })} className="h-40" label="Upload large photo" /></div>
        <div><p className="text-sm mb-2">3 small photos (fabrics, embroidery, colours)</p><MultiImageInput values={f.processImages || []} max={3} onChange={(v) => setF({ ...f, processImages: v })} /></div>
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-display text-2xl">About me</h3>
        {text('aboutTitle', 'Title')}
        {text('aboutText', 'Text', 5)}
      </Card>

      <Card className="p-5">
        <h3 className="font-display text-2xl mb-3">Look</h3>
        <div className="flex gap-6">
          <label className="text-sm">Heading font
            <select className="field mt-1" value={f.fontFamily} onChange={set('fontFamily')}>{fonts.map((x) => <option key={x}>{x}</option>)}</select>
          </label>
          <label className="text-sm">Accent colour
            <input type="color" className="block mt-1 h-10 w-20" value={f.accentColor} onChange={set('accentColor')} />
          </label>
        </div>
      </Card>

      <button className="btn-primary" onClick={save}>Save changes</button>
    </div>
  );
}
