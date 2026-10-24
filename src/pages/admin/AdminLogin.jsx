import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { auth, ADMIN_EMAIL, ADMIN_ID } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import useDesktopViewport from '../../lib/useDesktopViewport';
import { img } from '../../lib/img';

export default function AdminLogin() {
  useDesktopViewport();
  const { isAdmin } = useAuth();
  const { content: c } = useSite();
  const nav = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const photo = c.heroImage || c.heroImages?.[0];
  const initials = c.siteName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

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

  // Firebase emails a secure reset LINK to the admin email (it has no built-in numeric OTP)
  const forgot = async () => {
    setErr(''); setMsg('');
    try {
      await sendPasswordResetEmail(auth, ADMIN_EMAIL);
      setMsg('A password reset link was sent to the admin email. Open it to set a new password.');
    } catch { setErr('Could not send the reset email. Try again in a minute.'); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ '--accent': '#94505F' }}>
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white bg-espresso">
        {photo && <img src={img(photo, 1200)} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '70% 25%' }} />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
        <span className="relative font-display text-5xl font-light">{initials}</span>
        <div className="relative">
          <h1 className="font-display font-light text-4xl tracking-[0.2em] uppercase">Portfolio Admin</h1>
          <p className="mt-3 text-sm text-white/85 max-w-xs">Manage your collections, showcase your creativity, and grow your brand.</p>
        </div>
      </div>

      <div className="grid place-items-center bg-[#F7F1F0] px-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <h2 className="font-display text-5xl font-medium">Welcome Back</h2>
          <p className="text-sm text-ink/60 -mt-2">Sign in to your admin panel</p>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input className="field pl-10" placeholder="Email / Username" value={id} onChange={(e) => setId(e.target.value)} required autoComplete="username" />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input className="field pl-10 pr-10" type={show ? 'text' : 'password'} placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} required autoComplete="current-password" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50" aria-label="Show password">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {err && <p className="text-red-700 text-sm" role="alert">{err}</p>}
          {msg && <p className="text-emerald-700 text-sm">{msg}</p>}
          <button className="btn-primary w-full py-3" disabled={busy}>{busy ? 'Checking…' : 'Login'}</button>
          <button type="button" className="text-sm text-accent" onClick={forgot}>Forgot password?</button>
          <p className="text-xs text-ink/40 pt-16">© {new Date().getFullYear()} | {c.siteName} Admin</p>
        </form>
      </div>
    </div>
  );
}
