import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, increment, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { dayKey } from '../lib/dayKey';

// Counts one visit per browser session on the PUBLIC site (admin visits are ignored).
// "returning" = this browser has visited before (remembered in localStorage).
export default function VisitTracker() {
  const { pathname } = useLocation();
  const { isAdmin, loading } = useAuth();

  useEffect(() => {
    if (loading || isAdmin || pathname.startsWith('/admin')) return;
    try {
      if (sessionStorage.getItem('visit-counted')) return;
      sessionStorage.setItem('visit-counted', '1');
      const returning = !!localStorage.getItem('visitor-id');
      if (!returning) localStorage.setItem('visitor-id', String(Date.now()) + Math.random().toString(36).slice(2));
      const data = {
        views: increment(1),
        newVisitors: increment(returning ? 0 : 1),
        returningVisits: increment(returning ? 1 : 0),
      };
      setDoc(doc(db, 'stats', 'summary'), data, { merge: true }).catch(() => {});
      setDoc(doc(db, 'stats', 'd-' + dayKey()), { ...data, date: dayKey() }, { merge: true }).catch(() => {});
    } catch { /* storage blocked: skip counting */ }
  }, [pathname, isAdmin, loading]);

  return null;
}
