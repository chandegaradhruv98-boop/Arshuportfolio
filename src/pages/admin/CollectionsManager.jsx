import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Plus } from 'lucide-react';
import { db } from '../../firebase';
import { useToast } from '../../components/Toast';
import useCol from '../../hooks/useCol';
import { img } from '../../lib/img';
import { Card, ImageInput, MultiImageInput, PageHeader, Pill, fmtDate } from '../../components/admin/ui';

const categories = ['Indo-Western', 'Ethnic', 'Western', 'Bridal', 'Resort', 'Traditional'];
const blank = { name: '', category: 'Indo-Western', description: '', status: 'Published', coverUrl: '', gallery: [] };

function Form({ initial, onDone }) {
  const toast = useToast();
  const [f, setF] = useState(initial);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async () => {
    if (!f.name.trim()) return toast('Enter a collection name.', 'error');
    const { id, ...data } = f;
    try {
      if (id) await updateDoc(doc(db, 'collections', id), data);
      else await addDoc(collection(db, 'collections'), { ...data, createdAt: serverTimestamp() });
      toast('Collection saved', 'success');
      onDone();
    } catch { toast('Could not save the collection.', 'error'); }
  };

  return (
    <div>
      <PageHeader title={f.id ? 'Edit Collection' : 'Add Collection'} subtitle="Upload images, add details and showcase your collection" />
      <div className="grid grid-cols-[1.2fr_1fr] gap-5">
        <Card className="p-5 space-y-4">
          <label className="block text-sm">Collection Name *<input className="field mt-1" placeholder="e.g. Indo Western Fusion" value={f.name} onChange={set('name')} /></label>
          <label className="block text-sm">Category *
            <select className="field mt-1" value={f.category} onChange={set('category')}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
          </label>
          <label className="block text-sm">Description<textarea rows={5} className="field mt-1" placeholder="Write a short description about this collection." value={f.description} onChange={set('description')} /></label>
          <label className="block text-sm">Status
            <select className="field mt-1" value={f.status} onChange={set('status')}><option>Published</option><option>Draft</option></select>
          </label>
        </Card>
        <Card className="p-5 space-y-5">
          <div>
            <p className="text-sm mb-2">Cover image</p>
            <ImageInput value={f.coverUrl} onChange={(u) => setF({ ...f, coverUrl: u })} label="Upload cover image" hint="Click to choose. Tall photos look best." folder="collections" />
          </div>
          <div>
            <p className="text-sm mb-2">Collection gallery</p>
            <MultiImageInput values={f.gallery} onChange={(g) => setF({ ...f, gallery: g })} folder="collections" />
          </div>
        </Card>
      </div>
      <div className="flex justify-end gap-3 mt-5">
        <button className="btn-ghost bg-white" onClick={onDone}>Cancel</button>
        <button className="btn-primary" onClick={save}>Save Collection</button>
      </div>
    </div>
  );
}

export default function CollectionsManager() {
  const rows = useCol('collections');
  const toast = useToast();
  const [editing, setEditing] = useState(null);

  if (editing) return <Form initial={editing === 'new' ? blank : editing} onDone={() => setEditing(null)} />;

  const remove = (c) => window.confirm(`Delete "${c.name}"?`) && deleteDoc(doc(db, 'collections', c.id)).then(() => toast('Collection deleted', 'success'));

  return (
    <div>
      <PageHeader title="Manage Collections" subtitle="Create, edit and organize your fashion collections"
        action={<button className="btn-primary" onClick={() => setEditing('new')}><Plus size={16} /> Add New Collection</button>} />
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-ink/60 border-b border-ink/10">
            <tr><th className="p-3">Image</th><th>Collection Name</th><th>Category</th><th>Date Added</th><th>Status</th><th className="text-right pr-4">Actions</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="p-6 text-ink/50">No collections yet. Click “Add New Collection”.</td></tr>}
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-ink/5">
                <td className="p-3"><div className="h-14 w-11 bg-ink/10 rounded overflow-hidden">{c.coverUrl && <img src={img(c.coverUrl, 120)} alt="" className="w-full h-full object-cover" />}</div></td>
                <td>{c.name}</td><td className="text-ink/60">{c.category}</td><td className="text-ink/60">{fmtDate(c.createdAt)}</td>
                <td><Pill status={c.status} /></td>
                <td className="text-right pr-4 space-x-3 whitespace-nowrap">
                  <button className="text-accent" style={{ color: '#94505F' }} onClick={() => setEditing(c)}>Edit</button>
                  <button className="text-red-700" onClick={() => remove(c)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
