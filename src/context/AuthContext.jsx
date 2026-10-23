import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, updateProfile, sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, ADMIN_EMAIL } from '../firebase';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); }), []);

  // Live profile (name, contact) for shoppers
  useEffect(() => {
    if (!user || user.email === ADMIN_EMAIL) { setProfile(null); return; }
    return onSnapshot(doc(db, 'users', user.uid), (s) => setProfile(s.exists() ? s.data() : null));
  }, [user?.uid]);

  const isAdmin = !!user && user.email === ADMIN_EMAIL;

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const register = async ({ name, contact, email, password }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, 'users', cred.user.uid), { name, contact, email, createdAt: serverTimestamp() });
  };

  const logout = () => signOut(auth);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  return (
    <AuthCtx.Provider value={{ user, profile, isAdmin, loading, login, register, logout, resetPassword }}>
      {children}
    </AuthCtx.Provider>
  );
}
