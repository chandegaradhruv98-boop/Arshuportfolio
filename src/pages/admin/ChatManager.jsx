import { useEffect, useRef, useState } from 'react';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Send } from 'lucide-react';
import { db } from '../../firebase';
import useCol from '../../hooks/useCol';

export default function ChatManager() {
  const chats = useCol('chats', 'updatedAt');
  const [uid, setUid] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const end = useRef(null);

  useEffect(() => {
    if (!uid) return;
    updateDoc(doc(db, 'chats', uid), { unreadAdmin: false }).catch(() => {});
    return onSnapshot(query(collection(db, 'chats', uid, 'messages'), orderBy('createdAt')),
      (s) => setMsgs(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, [uid]);
  useEffect(() => { end.current?.scrollIntoView(); }, [msgs.length]);

  const send = async (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setText('');
    await addDoc(collection(db, 'chats', uid, 'messages'), { text: t, from: 'admin', createdAt: serverTimestamp() });
    await updateDoc(doc(db, 'chats', uid), { lastMessage: t, updatedAt: serverTimestamp() });
  };

  return (
    <div className="max-w-4xl">
      <h2 className="font-display text-4xl mb-4">Chat</h2>
      <div className="grid grid-cols-3 gap-4 h-[70vh]">
        <ul className="bg-white border border-ink/10 overflow-y-auto divide-y">
          {chats.length === 0 && <li className="p-4 text-sm text-ink/60">No messages yet.</li>}
          {chats.map((c) => (
            <li key={c.id}>
              <button onClick={() => setUid(c.id)} className={`w-full text-left p-3 ${uid === c.id ? 'bg-ink/10' : 'hover:bg-ink/5'}`}>
                <p className="font-medium text-sm flex items-center gap-2">{c.userName}{c.unreadAdmin && <span className="h-2 w-2 rounded-full bg-accent" />}</p>
                <p className="text-xs text-ink/60 truncate">{c.lastMessage}</p>
              </button>
            </li>
          ))}
        </ul>
        <div className="col-span-2 bg-white border border-ink/10 flex flex-col">
          {!uid ? <p className="p-4 text-sm text-ink/60">Select a conversation.</p> : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {msgs.map((m) => (
                  <div key={m.id} className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${m.from === 'admin' ? 'ml-auto bg-accent text-white' : 'bg-ink/10'}`}>{m.text}</div>
                ))}
                <div ref={end} />
              </div>
              <form onSubmit={send} className="p-3 border-t flex gap-2">
                <input className="field" value={text} onChange={(e) => setText(e.target.value)} placeholder="Reply" />
                <button className="btn-primary" aria-label="Send"><Send size={16} /></button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
