import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, ADMIN_EMAIL, ADMIN_ID } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { isAdmin } = useAuth();
  const nav = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (isAdmin) nav('/admin', { replace: true }); }, [isAdmin]);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg(''); setBusy(true);
    const email = id.trim() === ADMIN_ID ? ADMIN_EMAIL : id.trim();
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pw);
      if (cred.user.email !== ADMIN_EMAIL) { await signOut(auth); setErr('This account is not an admin.'); }
    } catch { setErr('Wrong ID or password.'); }
    finally { setBusy(false); }
  };

  // Firebase sends a secure reset LINK to the admin email (Firebase has no built-in numeric OTP).
  const forgot = async () => {
    setErr(''); setMsg('');
    try {
      await sendPasswordResetEmail(auth, ADMIN_EMAIL);
      setMsg('A password reset link was sent to the admin email. Open it to set a new password.');
    } catch { setErr('Could not send the reset email. Try again in a minute.'); }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-paper px-4">
      <form onSubmit={submit} className="bg-white border border-ink/10 p-8 w-full max-w-sm space-y-4">
        <h1 className="font-display text-4xl">Admin login</h1>
        <input className="field" placeholder="Admin ID or email" value={id} onChange={(e) => setId(e.target.value)} required autoComplete="username" />
        <input className="field" type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} required autoComplete="current-password" />
        {err && <p className="text-red-700 text-sm" role="alert">{err}</p>}
        {msg && <p className="text-emerald-700 text-sm">{msg}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Checking…' : 'Log in'}</button>
        <button type="button" className="text-sm underline" onClick={forgot}>Forgot password</button>
      </form>
    </div>
  );
}
