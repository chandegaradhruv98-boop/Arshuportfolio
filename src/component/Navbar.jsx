import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, ClipboardList, LogOut } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { content } = useSite();
  const { user, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const nav = useNavigate();
  const shopper = user && !isAdmin;

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-gold/40">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
        <Link to="/" className="flex items-center gap-2">
          {content.logoUrl && <img src={content.logoUrl} alt="" className="h-9 w-9 object-contain" />}
          <span className="font-display text-2xl font-semibold">{content.siteName}</span>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm">
          <a href="/#about" className="hover:text-accent">About</a>
          <a href="/#experience" className="hover:text-accent">Experience</a>
          <a href="/#projects" className="hover:text-accent">Projects</a>
          <a href="/#contact" className="hover:text-accent">Contact</a>
        </nav>

        <div className="flex items-center gap-1">
          {shopper && (
            <>
              <Link to="/orders" className="icon-btn" title="My orders" aria-label="My orders"><ClipboardList size={20} /></Link>
              <Link to="/cart" className="icon-btn relative" title="Cart" aria-label="Cart">
                <ShoppingCart size={20} />
                {count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] rounded-full h-4 min-w-4 px-1 grid place-items-center">{count}</span>}
              </Link>
              <button onClick={logout} className="icon-btn" title="Log out" aria-label="Log out"><LogOut size={20} /></button>
            </>
          )}
          <button onClick={() => nav('/shop')} className="btn-primary ml-2" aria-label="Buy outfits">
            <ShoppingBag size={18} /><span className="hidden sm:inline">Buy Outfits</span>
          </button>
        </div>
      </div>
    </header>
  );
}
