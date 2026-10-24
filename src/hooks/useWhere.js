import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';

// Live documents where field == value, newest first (sorted in the browser, so no index is needed).
export default function useWhere(name, field, value) {
  const [rows, setRows] = useState([]);
  useEffect(
    () => onSnapshot(query(collection(db, name), where(field, '==', value)), (s) =>
      setRows(s.docs.map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 9e12) - (a.createdAt?.seconds || 9e12)))),
    [name, field, value]
  );
  return rows;
}
