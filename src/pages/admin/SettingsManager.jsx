import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db, ADMIN_EMAIL } from '../../firebase';
import { useSite } from '../../context/SiteContext';
import { useToast } from '../../components/Toast';
import { Card, PageHeader } from '../../components/admin/ui';

export default function SettingsManager() {
  const { content, ready } = useSite();
  const toast = useToast();
  const [c, setC] = useState(null);
  useEffect(() => { if (ready && !c) setC(content.contact); }, [ready]);
  if (!c) return <p>Loading…</p>;

  const set = (k) => (e) => setC({ ...c, [k]: e.target.value });
  const save = async () => {
    try { await setDoc(doc(db, 'site', 'content'), { contact: c }, { merge: true }); toast('Contact links updated', 'success'); }
    catch { toast('Could not save.', 'error'); }
  };
  const reset = async () => {
    try { await sendPasswordResetEmail(auth, ADMIN_EMAIL); toast('Password reset link sent to the admin email.', 'success'); }
    catch { toast('Could not send the email. Try again in a minute.', 'error'); }
  };

  return (
    <div className="max-w-xl space-y-6">
      <PageHeader title="Settings" subtitle="Contact links shown in the website footer and About section" />
      <Card className="p-5 space-y-4">
        <label className="block text-sm">Instagram URL<input className="field mt-1" placeholder="https://instagram.com/…" value={c.instagram} onChange={set('instagram')} /></label>
        <label className="block text-sm">Pinterest URL<input className="field mt-1" placeholder="https://pinterest.com/…" value={c.pinterest || ''} onChange={set('pinterest')} /></label>
        <label className="block text-sm">LinkedIn URL<input className="field mt-1" placeholder="https://linkedin.com/in/…" value={c.linkedin} onChange={set('linkedin')} /></label>
        <label className="block text-sm">Email<input className="field mt-1" type="email" value={c.email} onChange={set('email')} /></label>
        <button className="btn-primary" onClick={save}>Save changes</button>
      </Card>
      <Card className="p-5">
        <h3 className="font-display text-2xl">Admin password</h3>
        <p className="text-sm text-ink/60 mt-1 mb-3">A secure reset link is emailed to {ADMIN_EMAIL}.</p>
        <button className="btn-ghost" onClick={reset}>Send password reset email</button>
      </Card>
    </div>
  );
}
