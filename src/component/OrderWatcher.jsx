import { useEffect, useRef } from 'react';
import { collection, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

// Free "push" alerts: a live Firestore listener shows an on-screen toast (and a browser
// notification if allowed) when the admin accepts or cancels an order.
export default function OrderWatcher() {
  const { user, isAdmin } = useAuth();
  const toast = useToast();
  const seen = useRef(new Set());

  useEffect(() => {
    if (!user || isAdmin) return;
    return onSnapshot(query(collection(db, 'orders'), where('userId', '==', user.uid)), (snap) => {
      snap.docs.forEach((d) => {
        const o = d.data();
        if (o.status !== 'Pending' && o.userNotified === false && !seen.current.has(d.id)) {
          seen.current.add(d.id);
          const msg = `Your order was ${o.status.toLowerCase()}.`;
          toast(msg, o.status === 'Accepted' ? 'success' : 'error');
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Order update', { body: msg });
          }
          updateDoc(d.ref, { userNotified: true }).catch(() => {});
        }
      });
    });
  }, [user?.uid, isAdmin]);

  return null;
}
