import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import { placeOrder } from '../lib/orders';

export default function Cart() {
  const { user, profile } = useAuth();
  const { items, setQty, remove, clear, total } = useCart();
  const toast = useToast();
  const nav = useNavigate();

  const checkout = async () => {
    try {
      await placeOrder(user, profile, items);
      clear();
      toast('Order placed. Waiting for the designer to accept.', 'success');
      nav('/orders');
    } catch { toast('Could not place the order. Try again.', 'error'); }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-5xl">Your cart</h1>
      {items.length === 0 ? (
        <p className="mt-6 text-ink/60">Your cart is empty. <Link to="/shop" className="underline">Browse outfits</Link></p>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-ink/10">
            {items.map((i) => (
              <li key={i.id} className="py-4 flex items-center gap-4">
                <img src={i.imageUrl} alt="" className="h-20 w-16 object-cover bg-ink/10" />
                <div className="flex-1">
                  <p className="font-display text-xl">{i.name}</p>
                  <p className="text-sm">₹{i.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="icon-btn" onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease"><Minus size={16} /></button>
                  <span>{i.qty}</span>
                  <button className="icon-btn" onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase"><Plus size={16} /></button>
                </div>
                <button className="icon-btn" onClick={() => remove(i.id)} aria-label="Remove"><Trash2 size={18} /></button>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xl">Total: <b>₹{total}</b></p>
            <button className="btn-primary" onClick={checkout}>Place order</button>
          </div>
        </>
      )}
    </section>
  );
}
