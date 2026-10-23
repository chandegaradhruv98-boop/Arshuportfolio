
import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AtSign, Briefcase, ExternalLink, LogOut, MessageSquare, Package, Palette, Shirt } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SiteEditor from './SiteEditor';
import ListsManager from './ListsManager';
import ContactManager from './ContactManager';
import StoreManager from './StoreManager';
import OrderManager from './OrderManager';
import ChatManager from './ChatManager';

const tabs = [
  ['site', 'Website', Palette, SiteEditor],
  ['lists', 'Experience & projects', Briefcase, ListsManager],
  ['contact', 'Contact links', AtSign, ContactManager],
  ['store', 'Store', Shirt, StoreManager],
  ['orders', 'Orders', Package, OrderManager],
  ['chat', 'Chat', MessageSquare, ChatManager],
];

function useDesktop() {
  const [ok, setOk] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    const on = () => setOk(window.innerWidth >= 1024);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return ok;
}

export default function AdminDashboard() {
  const { isAdmin, loading, logout } = useAuth();
  const desktop = useDesktop();
  const [tab, setTab] = useState('site');

  if (loading) return <p className="p-10 text-center">Loading…</p>;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  // UI-level restriction. Real protection comes from the Firestore/Storage rules.
  if (!desktop) {
    return (
      <div className="min-h-screen grid place-items-center p-8 text-center">
        <div>
          <h1 className="font-display text-4xl">Open this on a desktop</h1>
          <p className="mt-3 text-ink/70">The admin dashboard is only available on a desktop or laptop screen.</p>
          <button className="btn-ghost mt-6" onClick={logout}>Log out</button>
        </div>
      </div>
    );
  }

  const Active = tabs.find((t) => t[0] === tab)[3];
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-ink text-white p-5 flex flex-col">
        <h1 className="font-display text-3xl mb-8">Admin</h1>
        <nav className="space-y-1 flex-1">
          {tabs.map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-left ${tab === key ? 'bg-white/15' : 'hover:bg-white/10'}`}>
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
        <Link to="/" className="flex items-center gap-2 text-sm text-white/70 hover:text-white mb-3"><ExternalLink size={16} /> View website</Link>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-white/70 hover:text-white"><LogOut size={16} /> Log out</button>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto max-h-screen"><Active /></main>
    </div>
  );
}
