
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const messages = {
  'auth/email-already-in-use': 'An account with this email already exists. Log in instead.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-email': 'Enter a valid email address.',
};

export default function Login() {
  const { user, isAdmin, login, register, resetPassword } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const toast = useToast();
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', contact: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => { if (user && !isAdmin) nav(loc.state?.from || '/shop', { replace: true }); }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      if (mode === 'login') await login(f.email.trim(), f.password);
      else await register({ ...f, email: f.email.trim(), name: f.name.trim(), contact: f.contact.trim() });
    } catch (ex) {
      setErr(messages[ex.code] || 'Something went wrong. Please try again.');
    } finally { setBusy(false); }
  };

  const forgot = async () => {
    if (!f.email) return setErr('Enter your email first, then tap “Forgot password”.');
    try { await resetPassword(f.email.trim()); toast('Password reset link sent. Check your email.', 'success'); }
    catch { setErr('Could not send the reset link. Check the email address.'); }
  };

  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-4xl">{mode === 'login' ? 'Log in to buy outfits' : 'Create your account'}</h1>
      <p className="text-ink/70 mt-2 text-sm">You need an account to see the outfit catalog and place orders.</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        {mode === 'register' && (
          <>
            <input className="field" placeholder="Full name" value={f.name} onChange={set('name')} required />
            <input className="field" placeholder="Contact number" value={f.contact} onChange={set('contact')} required />
          </>
        )}
        <input className="field" type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
        <input className="field" type="password" placeholder="Password (min 6 characters)" value={f.password} onChange={set('password')} required minLength={6} />
        {err && <p className="text-red-700 text-sm" role="alert">{err}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Register'}</button>
      </form>

      <div className="mt-5 flex justify-between text-sm">
        <button className="underline" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>
          {mode === 'login' ? 'New here? Register' : 'Have an account? Log in'}
        </button>
        {mode === 'login' && <button className="underline" onClick={forgot}>Forgot password</button>}
      </div>
    </section>
  );
}
