import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useToast } from '../../components/Toast';
import useCol from '../../hooks/useCol';

const badge = { Pending: 'bg-amber-100 text-amber-800', Accepted: 'bg-emerald-100 text-emerald-800', Cancelled: 'bg-red-100 text-red-800' };

export default function OrderManager() {
  const orders = useCol('orders');
  const toast = useToast();

  // userNotified:false triggers the alert on the customer's screen
  const setStatus = (o, status) =>
    updateDoc(doc(db, 'orders', o.id), { status, userNotified: false, updatedAt: serverTimestamp() })
      .then(() => toast(`Order ${status.toLowerCase()}`, 'success'))
      .catch(() => toast('Could not update the order.', 'error'));

  return (
    <div className="max-w-4xl">
      <h2 className="font-display text-4xl mb-4">Orders</h2>
      {orders.length === 0 && <p className="text-ink/60">No orders yet.</p>}
      <div className="space-y-4">
        {orders.map((o) => (
          <article key={o.id} className="bg-white border border-ink/10 p-4">
            <div className="flex justify-between items-start">
              <div className="text-sm">
                <p className="font-medium">{o.userName}</p>
                <p>{o.userContact} · {o.userEmail}</p>
                <p className="text-ink/60">{o.createdAt?.toDate().toLocaleString()}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${badge[o.status]}`}>{o.status}</span>
            </div>
            <ul className="mt-3 text-sm space-y-1">
              {o.items.map((i) => <li key={i.id}>{i.name} × {i.qty} — ₹{i.price * i.qty}</li>)}
            </ul>
            <div className="mt-3 flex items-center justify-between">
              <p className="font-medium">Total: ₹{o.total}</p>
              {o.status === 'Pending' && (
                <div className="flex gap-2">
                  <button className="btn-ghost" onClick={() => setStatus(o, 'Cancelled')}>Cancel</button>
                  <button className="btn-primary" onClick={() => setStatus(o, 'Accepted')}>Accept</button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
