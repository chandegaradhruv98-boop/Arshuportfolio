import { Fragment, useState } from 'react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import useCol from '../../hooks/useCol';
import { Card, PageHeader, Pill, fmtDate } from '../../components/admin/ui';

export default function MessagesManager() {
  const rows = useCol('messages');
  const [open, setOpen] = useState(null);
  const setStatus = (m, status) => updateDoc(doc(db, 'messages', m.id), { status });

  const toggle = (m) => {
    setOpen(open === m.id ? null : m.id);
    if (m.status === 'New') setStatus(m, 'Read');
  };

  return (
    <div>
      <PageHeader title="Contact Messages" subtitle="View and manage inquiries from visitors (sent from the contact form on your website)" />
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-ink/60 border-b border-ink/10">
            <tr><th className="p-3">Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="p-6 text-ink/50">No messages yet.</td></tr>}
            {rows.map((m) => (
              <Fragment key={m.id}>
                <tr className="border-b border-ink/5 cursor-pointer hover:bg-ink/[0.03]" onClick={() => toggle(m)}>
                  <td className="p-3">{m.name}</td><td className="text-ink/60">{m.email}</td><td>{m.subject}</td>
                  <td className="text-ink/60 max-w-[220px] truncate">{m.message}</td><td className="text-ink/60">{fmtDate(m.createdAt)}</td><td><Pill status={m.status} /></td>
                </tr>
                {open === m.id && (
                  <tr className="bg-ink/[0.03]">
                    <td colSpan={6} className="p-4">
                      <p className="whitespace-pre-line">{m.message}</p>
                      <div className="flex gap-3 mt-3">
                        <a className="btn-primary" href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || '')}`} onClick={() => setStatus(m, 'Replied')}>Reply by email</a>
                        <button className="btn-ghost bg-white" onClick={() => setStatus(m, 'Read')}>Mark read</button>
                        <button className="btn-ghost bg-white text-red-700" onClick={() => window.confirm('Delete this message?') && deleteDoc(doc(db, 'messages', m.id))}>Delete</button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
