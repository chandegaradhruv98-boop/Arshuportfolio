import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Bell } from 'lucide-react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const badge = {
  Pending: 'bg-amber-100 text-amber-800',
  Accepted: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-red-100 text-red-800',
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [perm, setPerm] = useState('Notification' in window ? Notification.permission : 'denied');

  useEffect(
    () => onSnapshot(query(collection(db, 'orders'), where('userId', '==', user.uid)), (s) =>
      setOrders(s.docs.map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 9e12) - (a.createdAt?.seconds || 9e12)))),
    [user.uid]
  );

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-5xl">My orders</h1>
        {perm === 'default' && (
          <button className="btn-ghost" onClick={async () => setPerm(await Notification.requestPermission())}>
            <Bell size={16} /> Turn on alerts
          </button>
        )}
      </div>
      {orders.length === 0 && <p className="mt-6 text-ink/60">You haven’t placed any orders yet.</p>}
      <div className="mt-8 space-y-4">
        {orders.map((o) => (
          <article key={o.id} className="bg-white border border-ink/10 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink/60">{o.createdAt?.toDate().toLocaleString() || 'Just now'}</p>
              <span className={`text-xs px-3 py-1 rounded-full ${badge[o.status]}`}>{o.status}</span>
            </div>
            <ul className="mt-3 text-sm space-y-1">
              {o.items.map((i) => <li key={i.id}>{i.name} × {i.qty} — ₹{i.price * i.qty}</li>)}
            </ul>
            <p className="mt-3 font-medium">Total: ₹{o.total}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
