import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const key = `cart:${user?.uid || 'guest'}`;
  const [items, setItems] = useState([]);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(key)) || []); } catch { setItems([]); }
  }, [key]);

  const commit = (next) => {
    setItems(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };

  const add = (o) => {
    const found = items.find((i) => i.id === o.id);
    commit(found
      ? items.map((i) => (i.id === o.id ? { ...i, qty: i.qty + 1 } : i))
      : [...items, { id: o.id, name: o.name, price: Number(o.price), imageUrl: o.imageUrl, qty: 1 }]);
  };
  const setQty = (id, qty) => commit(qty < 1 ? items.filter((i) => i.id !== id) : items.map((i) => (i.id === id ? { ...i, qty } : i)));
  const remove = (id) => commit(items.filter((i) => i.id !== id));
  const clear = () => commit([]);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return <CartCtx.Provider value={{ items, add, setQty, remove, clear, count, total }}>{children}</CartCtx.Provider>;
}
