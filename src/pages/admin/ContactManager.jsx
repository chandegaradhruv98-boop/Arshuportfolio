import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useSite } from '../../context/SiteContext';
import { useToast } from '../../components/Toast';

export default function ContactManager() {
  const { content, ready } = useSite();
  const toast = useToast();
  const [c, setC] = useState(null);
  useEffect(() => { if (ready && !c) setC(content.contact); }, [ready]);
  if (!c) return <p>Loading…</p>;

  const save = async () => {
    try { await setDoc(doc(db, 'site', 'content'), { contact: c }, { merge: true }); toast('Contact links updated', 'success'); }
    catch { toast('Could not save.', 'error'); }
  };

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="font-display text-4xl">Contact links</h2>
      <label className="block text-sm">Instagram URL<input className="field mt-1" placeholder="https://instagram.com/…" value={c.instagram} onChange={(e) => setC({ ...c, instagram: e.target.value })} /></label>
      <label className="block text-sm">LinkedIn URL<input className="field mt-1" placeholder="https://linkedin.com/in/…" value={c.linkedin} onChange={(e) => setC({ ...c, linkedin: e.target.value })} /></label>
      <label className="block text-sm">Email<input className="field mt-1" type="email" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} /></label>
      <button className="btn-primary" onClick={save}>Save changes</button>
    </div>
  );
}
