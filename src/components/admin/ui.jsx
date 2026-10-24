import { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { useToast } from '../Toast';
import { uploadImage } from '../../lib/upload';
import { img } from '../../lib/img';

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h2 className="font-display text-4xl font-medium">{title}</h2>
        {subtitle && <p className="text-sm text-ink/60 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-ink/10 rounded-lg ${className}`}>{children}</div>
);

const pill = {
  Published: 'bg-emerald-50 text-emerald-700', Accepted: 'bg-emerald-50 text-emerald-700',
  Read: 'bg-emerald-50 text-emerald-700', Replied: 'bg-sky-50 text-sky-700',
  Draft: 'bg-rose-50 text-rose-700', Cancelled: 'bg-rose-50 text-rose-700',
  Pending: 'bg-amber-50 text-amber-700', New: 'bg-amber-50 text-amber-700',
};
export const Pill = ({ status }) => (
  <span className={`text-xs px-3 py-1 rounded-full ${pill[status] || 'bg-ink/5'}`}>{status}</span>
);

// One image: click to choose, shows a preview
export function ImageInput({ value, onChange, label = 'Click to upload image', hint, className = 'h-44', folder = 'site' }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const pick = async (file) => {
    if (!file) return;
    setBusy(true);
    try { onChange(await uploadImage(file, folder)); }
    catch (e) { toast(e.message, 'error'); }
    finally { setBusy(false); }
  };
  return (
    <label className={`relative block border border-dashed border-ink/30 rounded-lg overflow-hidden cursor-pointer bg-white ${className}`}>
      {value
        ? <img src={img(value, 600)} alt="" className="w-full h-full object-cover" />
        : <div className="h-full grid place-items-center text-center text-xs text-ink/60 p-4">
            <div><ImagePlus className="mx-auto mb-2" size={26} /><p>{busy ? 'Uploading…' : label}</p>{hint && <p className="text-[11px] text-ink/40 mt-1">{hint}</p>}</div>
          </div>}
      {value && <span className="absolute bottom-2 right-2 bg-white/90 text-xs px-2 py-1 rounded">{busy ? 'Uploading…' : 'Change'}</span>}
      <input type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files[0])} />
    </label>
  );
}

// Several images: thumbnails with remove buttons and an "Add images" button
export function MultiImageInput({ values = [], onChange, max = 20, folder = 'site' }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const add = async (files) => {
    setBusy(true);
    const urls = [];
    for (const f of Array.from(files).slice(0, max - values.length)) {
      try { urls.push(await uploadImage(f, folder)); } catch (e) { toast(e.message, 'error'); }
    }
    if (urls.length) onChange([...values, ...urls]);
    setBusy(false);
  };
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {values.map((u, i) => (
        <div key={u + i} className="relative">
          <img src={img(u, 200)} alt="" className="h-16 w-16 object-cover rounded" />
          <button type="button" className="absolute -top-2 -right-2 bg-white border rounded-full p-0.5" aria-label="Remove image"
            onClick={() => onChange(values.filter((_, j) => j !== i))}><X size={14} /></button>
        </div>
      ))}
      {values.length < max && (
        <label className="h-16 px-4 border border-dashed border-ink/30 rounded grid place-items-center text-xs cursor-pointer bg-white">
          {busy ? 'Uploading…' : '+ Add images'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => add(e.target.files)} />
        </label>
      )}
    </div>
  );
}

export const fmtDate = (ts) => (ts?.toDate ? ts.toDate().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : 'Just now');
