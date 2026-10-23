import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

// Live list of documents from a collection, newest first.
export default function useCol(name, field = 'createdAt') {
  const [rows, setRows] = useState([]);
  useEffect(
    () => onSnapshot(query(collection(db, name), orderBy(field, 'desc')), (s) =>
      setRows(s.docs.map((d) => ({ id: d.id, ...d.data() })))),
    [name, field]
  );
  return rows;
}
