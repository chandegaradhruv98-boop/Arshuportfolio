import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function placeOrder(user, profile, items) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  await addDoc(collection(db, 'orders'), {
    userId: user.uid,
    userName: profile?.name || user.displayName || '',
    userContact: profile?.contact || '',
    userEmail: user.email,
    items,
    total,
    status: 'Pending',
    userNotified: true, // becomes false when admin accepts/cancels, so the user gets alerted
    createdAt: serverTimestamp(),
  });
}
