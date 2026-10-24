import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, ClipboardList, LogOut, Menu, X } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const links = [['Home', '/'], ['Collections', '/#collections'], ['Portfolio', '/#portfolio'], ['About', '/#about'], ['Contact', '/#contact']];

export default function Navbar() {
  const { content } = useSite();
  const { user, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const clear = pathname === '/' && !scrolled && !open; // transparent over the hero photo
  const shopper = user && !isAdmin;
  const initials = content.siteName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${clear ? 'bg-transparent text-white' : 'bg-paper/95 backdrop-blur text-ink border-b border-sand'}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <Link to="/" className="flex items-center gap-4">
          {content.logoUrl
            ? <img src={content.logoUrl} alt={content.siteName} className="h-10 w-10 object-contain" />
            : <span className="font-display text-3xl font-light tracking-wide">{initials}</span>}
          <span className="hidden sm:block h-8 w-px bg-current opacity-40" />
          <span className="hidden sm:block text-[11px] uppercase tracking-[0.3em]">{content.tagline}</span>
        </Link>

        <nav className="hidden md:flex gap-9 text-[11px] uppercase tracking-[0.2em]">
          {links.map(([label, href]) => <a key={label} href={href} className="hover:opacity-60 transition">{label}</a>)}
        </nav>

        <div className="flex items-center gap-1">
          {shopper && (
            <>
              <Link to="/orders" className="icon-btn" title="My orders" aria-label="My orders"><ClipboardList size={19} /></Link>
              <Link to="/cart" className="icon-btn relative" title="Cart" aria-label="Cart">
                <ShoppingCart size={19} />
                {count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] rounded-full h-4 min-w-4 px-1 grid place-items-center">{count}</span>}
              </Link>
              <button onClick={logout} className="icon-btn" title="Log out" aria-label="Log out"><LogOut size={19} /></button>
            </>
          )}
          <button onClick={() => nav('/shop')} aria-label="Buy outfits"
            className={`ml-2 inline-flex items-center gap-2 border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition ${clear ? 'border-white/70 hover:bg-white hover:text-ink' : 'border-ink/40 hover:bg-ink hover:text-white'}`}>
            <ShoppingBag size={16} /><span className="hidden sm:inline">Buy Outfits</span>
          </button>
          <button className="icon-btn md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden bg-paper text-ink border-t border-sand px-6 py-4 flex flex-col gap-4 text-xs uppercase tracking-[0.2em]">
          {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        </nav>
      )}
    </header>
  );
}
