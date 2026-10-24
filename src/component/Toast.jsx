import { createContext, useCallback, useContext, useState } from 'react';

const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [list, setList] = useState([]);
  const push = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setList((l) => [...l, { id, message, type }]);
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 5000);
  }, []);
  const colors = { info: 'bg-ink', success: 'bg-emerald-700', error: 'bg-red-700' };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-2" role="status" aria-live="polite">
        {list.map((t) => (
          <div key={t.id} className={`${colors[t.type]} text-white px-4 py-3 rounded-md shadow-lg text-sm max-w-xs`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
