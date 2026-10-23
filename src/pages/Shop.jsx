
import { useState } from 'react';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { CalendarCheck, Heart, MessageCircle } from 'lucide-react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import ChatWidget from '../components/ChatWidget';
import useCol from '../hooks/useCol';
import { placeOrder } from '../lib/orders';

export default function Shop() {
  const { user, profile } = useAuth();
  const { add } = useCart();
  const toast = useToast();
  const outfits = useCol('outfits');
  const [chatFor, setChatFor] = useState(null);

  const like = (o) => updateDoc(doc(db, 'outfits', o.id), {
    likedBy: o.likedBy?.includes(user.uid) ? arrayRemove(user.uid) : arrayUnion(user.uid),
  }).catch(() => toast('Could not update like.', 'error'));

  const book = async (o) => {
    if (!window.confirm(`Order “${o.name}” for ₹${o.price}?`)) return;
    try {
      await placeOrder(user, profile, [{ id: o.id, name: o.name, price: Number(o.price), imageUrl: o.imageUrl, qty: 1 }]);
      toast('Order placed. Track it under “My orders”.', 'success');
    } catch { toast('Could not place the order.', 'error'); }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-display text-5xl">Outfits</h1>
      {outfits.length === 0 && <p className="mt-6 text-ink/60">New outfits are on the way. Check back soon.</p>}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {outfits.map((o) => {
          const liked = o.likedBy?.includes(user.uid);
          return (
            <article key={o.id} className="bg-white border border-ink/10">
              <div className="aspect-[4/5] bg-ink/10 overflow-hidden">
                {o.imageUrl && <img src={o.imageUrl} alt={o.name} className="w-full h-full object-cover" />}
              </div>
              <div className="p-4">
                <h2 className="font-display text-2xl">{o.name}</h2>
                <p className="text-sm text-ink/70 line-clamp-2">{o.description}</p>
                <p className="mt-2 font-medium">₹{o.price}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <button className="icon-btn" onClick={() => book(o)} title="Order / Book" aria-label="Order or book"><CalendarCheck size={20} /></button>
                    <button className="icon-btn flex items-center gap-1" onClick={() => like(o)} title="Like" aria-label="Like">
                      <Heart size={20} className={liked ? 'text-accent' : ''} fill={liked ? 'currentColor' : 'none'} />
                      <span className="text-xs">{o.likedBy?.length || 0}</span>
                    </button>
                    <button className="icon-btn" onClick={() => setChatFor(o)} title="Chat" aria-label="Chat"><MessageCircle size={20} /></button>
                  </div>
                  <button className="btn-ghost" onClick={() => { add(o); toast('Added to cart', 'success'); }}>Add to cart</button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {chatFor && <ChatWidget outfit={chatFor} onClose={() => setChatFor(null)} />}
    </section>
  );
}
