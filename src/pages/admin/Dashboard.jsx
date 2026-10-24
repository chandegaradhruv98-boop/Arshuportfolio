import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { Eye, Layers, Mail, Package, Repeat, Sparkles, Users, Briefcase, CalendarDays } from 'lucide-react';
import { db } from '../../firebase';
import useCol from '../../hooks/useCol';
import { dayKey } from '../../lib/dayKey';
import { img } from '../../lib/img';
import { Card, PageHeader, fmtDate } from '../../components/admin/ui';

const zero = { views: 0, newVisitors: 0, returningVisits: 0 };

function Stat({ label, value, sub, Icon, onClick }) {
  return (
    <button onClick={onClick} className="text-left">
      <Card className="p-5 hover:shadow-sm transition">
        <div className="flex items-start justify-between">
          <p className="text-sm text-ink/70">{label}</p>
          <span className="h-9 w-9 rounded-full grid place-items-center text-accent" style={{ background: 'rgba(148,80,95,.1)' }}><Icon size={17} /></span>
        </div>
        <p className="font-display text-4xl font-medium mt-1">{value}</p>
        {sub && <p className="text-xs text-ink/50 mt-1">{sub}</p>}
      </Card>
    </button>
  );
}

export default function Dashboard({ go, orders, messages }) {
  const collections = useCol('collections');
  const projects = useCol('projects');
  const [sum, setSum] = useState(zero);
  const [daily, setDaily] = useState({});

  useEffect(() => onSnapshot(doc(db, 'stats', 'summary'), (s) => setSum({ ...zero, ...(s.exists() ? s.data() : {}) }), () => {}), []);
  useEffect(() => onSnapshot(
    query(collection(db, 'stats'), where('date', '>=', dayKey(-13)), orderBy('date')),
    (s) => setDaily(Object.fromEntries(s.docs.map((d) => [d.data().date, d.data()]))),
    () => {}
  ), []);

  const days = Array.from({ length: 14 }, (_, i) => dayKey(i - 13));
  const series = days.map((d) => ({ d, n: daily[d]?.newVisitors || 0, r: daily[d]?.returningVisits || 0 }));
  const max = Math.max(1, ...series.map((x) => x.n + x.r));
  const today = daily[dayKey()]?.views || 0;
  const pending = orders.filter((o) => o.status === 'Pending').length;
  const unread = messages.filter((m) => m.status === 'New').length;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Here’s what’s happening with your portfolio" />

      <div className="grid grid-cols-4 gap-4">
        <Stat label="Total Visits" value={sum.views} sub="every visit to your website" Icon={Eye} />
        <Stat label="Unique Visitors" value={sum.newVisitors} sub="different devices / browsers" Icon={Users} />
        <Stat label="Returning Visits" value={sum.returningVisits} sub="people who came back" Icon={Repeat} />
        <Stat label="Visits Today" value={today} Icon={CalendarDays} />
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <Stat label="Total Collections" value={collections.length} Icon={Layers} onClick={() => go('collections')} />
        <Stat label="Total Projects" value={projects.length} Icon={Briefcase} onClick={() => go('lists')} />
        <Stat label="New Messages" value={unread} sub={`${messages.length} total`} Icon={Mail} onClick={() => go('messages')} />
        <Stat label="Pending Orders" value={pending} sub={`${orders.length} total`} Icon={Package} onClick={() => go('orders')} />
      </div>

      <div className="grid grid-cols-[1.4fr_1fr] gap-4 mt-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-2xl">Visitors · last 14 days</h3>
            <div className="flex gap-4 text-xs text-ink/60">
              <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-sm bg-accent inline-block" style={{ background: '#94505F' }} /> New</span>
              <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-sm inline-block" style={{ background: '#D9B8C0' }} /> Returning</span>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-40">
            {series.map((x) => (
              <div key={x.d} className="flex-1 flex flex-col justify-end h-full" title={`${x.d}: ${x.n} new, ${x.r} returning`}>
                <div style={{ height: `${(x.r / max) * 100}%`, background: '#D9B8C0' }} />
                <div style={{ height: `${(x.n / max) * 100}%`, background: '#94505F' }} />
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 mt-1">
            {series.map((x) => <span key={x.d} className="flex-1 text-center text-[10px] text-ink/50">{x.d.slice(8)}</span>)}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-2xl">Latest messages</h3>
            <button className="text-xs text-accent" style={{ color: '#94505F' }} onClick={() => go('messages')}>View all →</button>
          </div>
          {messages.length === 0 && <p className="text-sm text-ink/50">No messages yet.</p>}
          <ul className="divide-y divide-ink/10">
            {messages.slice(0, 4).map((m) => (
              <li key={m.id} className="py-2.5">
                <p className="text-sm font-medium flex justify-between"><span>{m.name}</span><span className="text-[11px] text-ink/40 font-normal">{fmtDate(m.createdAt)}</span></p>
                <p className="text-xs text-ink/60 truncate">{m.subject || m.message}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-2xl">Recent collections</h3>
          <button className="text-xs" style={{ color: '#94505F' }} onClick={() => go('collections')}>View all →</button>
        </div>
        {collections.length === 0 && <p className="text-sm text-ink/50">No collections yet. Add your first one from the Collections tab.</p>}
        <div className="grid grid-cols-4 gap-4">
          {collections.slice(0, 4).map((c) => (
            <div key={c.id}>
              <div className="aspect-[3/4] bg-ink/10 rounded overflow-hidden">{c.coverUrl && <img src={img(c.coverUrl, 400)} alt="" className="w-full h-full object-cover" />}</div>
              <p className="text-sm mt-2">{c.name}</p>
              <p className="text-xs text-ink/50">{c.category} · {(c.gallery?.length || 0) + (c.coverUrl ? 1 : 0)} images</p>
            </div>
          ))}
        </div>
      </Card>
      <p className="text-xs text-ink/40 mt-4 flex items-center gap-1"><Sparkles size={12} /> Visits are counted once per browser session on the public site. Your own admin visits are not counted.</p>
    </div>
  );
}
