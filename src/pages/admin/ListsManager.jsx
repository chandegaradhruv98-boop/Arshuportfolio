import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Plus, Trash2 } from 'lucide-react';
import { db } from '../../firebase';
import { useToast } from '../../components/Toast';
import useCol from '../../hooks/useCol';
import { uploadImage } from '../../lib/upload';
import { img } from '../../lib/img';
import { Card, PageHeader } from '../../components/admin/ui';

// Fields save automatically when you tap outside them (blur).
export default function ListsManager() {
  const toast = useToast();
  const experiences = useCol('experiences');
  const projects = useCol('projects');
  const upd = (col, id, data) => updateDoc(doc(db, col, id), data).catch(() => toast('Could not save.', 'error'));
  const del = (col, id) => window.confirm('Delete this item?') && deleteDoc(doc(db, col, id));

  const addExp = () => addDoc(collection(db, 'experiences'), { company: '', role: '', years: 0, months: 0, current: false, createdAt: serverTimestamp() });
  const addProj = () => addDoc(collection(db, 'projects'), { title: '', description: '', imageUrl: '', createdAt: serverTimestamp() });
  const setImage = async (id, file) => {
    if (!file) return;
    try { await upd('projects', id, { imageUrl: await uploadImage(file, 'projects') }); }
    catch (e) { toast(e.message, 'error'); }
  };

  return (
    <div className="space-y-10">
      <section>
        <PageHeader title="Work experience" subtitle="Columns: Company, Role, Years, Months, Currently working"
          action={<button className="btn-primary" onClick={addExp} aria-label="Add experience"><Plus size={16} /> Add</button>} />
        <div className="space-y-3">
          {experiences.length === 0 && <p className="text-sm text-ink/50">Click “Add” to add your first work experience.</p>}
          {experiences.map((e) => (
            <div key={e.id} className="grid grid-cols-12 gap-3 items-center">
              <input className="field col-span-3" placeholder="Company" defaultValue={e.company} onBlur={(x) => upd('experiences', e.id, { company: x.target.value })} />
              <input className="field col-span-3" placeholder="Role" defaultValue={e.role} onBlur={(x) => upd('experiences', e.id, { role: x.target.value })} />
              <input className="field col-span-1" type="number" min="0" placeholder="Yrs" title="Years" defaultValue={e.years || 0} onBlur={(x) => upd('experiences', e.id, { years: Number(x.target.value) })} />
              <input className="field col-span-1" type="number" min="0" max="11" placeholder="Mo" title="Months" defaultValue={e.months || 0} onBlur={(x) => upd('experiences', e.id, { months: Number(x.target.value) })} />
              <select className="field col-span-3" title="Currently working" defaultValue={e.current ? 'Yes' : 'No'} onChange={(x) => upd('experiences', e.id, { current: x.target.value === 'Yes' })}>
                <option>Yes</option><option>No</option>
              </select>
              <button className="icon-btn col-span-1" onClick={() => del('experiences', e.id)} aria-label="Delete"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <PageHeader title="Projects" subtitle="Portfolio projects shown on the website"
          action={<button className="btn-primary" onClick={addProj} aria-label="Add project"><Plus size={16} /> Add</button>} />
        <div className="space-y-4">
          {projects.length === 0 && <p className="text-sm text-ink/50">Click “Add” to add your first project.</p>}
          {projects.map((p) => (
            <Card key={p.id} className="flex gap-4 items-start p-3">
              <div className="w-24 shrink-0">
                <div className="h-28 bg-ink/10 overflow-hidden rounded">{p.imageUrl && <img src={img(p.imageUrl, 200)} alt="" className="w-full h-full object-cover" />}</div>
                <input type="file" accept="image/*" className="text-xs mt-1 w-full" onChange={(e) => setImage(p.id, e.target.files[0])} />
              </div>
              <div className="flex-1 space-y-2">
                <input className="field" placeholder="Project title" defaultValue={p.title} onBlur={(x) => upd('projects', p.id, { title: x.target.value })} />
                <textarea className="field" rows={2} placeholder="Short description" defaultValue={p.description} onBlur={(x) => upd('projects', p.id, { description: x.target.value })} />
              </div>
              <button className="icon-btn" onClick={() => del('projects', p.id)} aria-label="Delete"><Trash2 size={18} /></button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
