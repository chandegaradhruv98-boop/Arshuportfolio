import { useEffect, useRef, useState } from 'react';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { Send, X } from 'lucide-react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function ChatWidget({ outfit, onClose }) {
  const { user, profile } = useAuth();
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState(outfit ? `Hi! I’m interested in “${outfit.name}”. ` : '');
  const end = useRef(null);

  useEffect(
    () => onSnapshot(query(collection(db, 'chats', user.uid, 'messages'), orderBy('createdAt')),
      (s) => setMsgs(s.docs.map((d) => ({ id: d.id, ...d.data() })))),
    [user.uid]
  );
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs.length]);

  const send = async (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setText('');
    await setDoc(doc(db, 'chats', user.uid), {
      userName: profile?.name || user.displayName || user.email,
      userEmail: user.email,
      lastMessage: t,
      updatedAt: serverTimestamp(),
      unreadAdmin: true,
    }, { merge: true });
    await addDoc(collection(db, 'chats', user.uid, 'messages'), { text: t, from: 'user', createdAt: serverTimestamp() });
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md h-[80vh] sm:h-[70vh] rounded-t-xl sm:rounded-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-display text-2xl">Chat with the designer</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close chat"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {msgs.length === 0 && <p className="text-sm text-ink/60">Ask about sizing, fabric or custom changes.</p>}
          {msgs.map((m) => (
            <div key={m.id} className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${m.from === 'user' ? 'ml-auto bg-accent text-white' : 'bg-ink/10'}`}>
              {m.text}
            </div>
          ))}
          <div ref={end} />
        </div>
        <form onSubmit={send} className="p-3 border-t flex gap-2">
          <input className="field" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message" />
          <button className="btn-primary" aria-label="Send"><Send size={16} /></button>
        </form>
      </div>
    </div>
  );
}
