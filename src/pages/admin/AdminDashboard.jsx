import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
  Bell, Briefcase, ExternalLink, Images, Layers, LayoutDashboard, LogOut,
  Mail, MessageSquare, Package, Palette, Settings, Shirt,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import useCol from '../../hooks/useCol';
import useDesktopViewport from '../../lib/useDesktopViewport';
import Dashboard from './Dashboard';
import CollectionsManager from './CollectionsManager';
import MediaManager from './MediaManager';
import ListsManager from './ListsManager';
import SiteEditor from './SiteEditor';
import StoreManager from './StoreManager';
import OrderManager from './OrderManager';
import ChatManager from './ChatManager';
import MessagesManager from './MessagesManager';
import SettingsManager from './SettingsManager';

const tabs = [
  ['dashboard', 'Dashboard', LayoutDashboard, Dashboard],
  ['collections', 'Collections', Layers, CollectionsManager],
  ['portfolio', 'Portfolio', Images, MediaManager],
  ['lists', 'Experience & Projects', Briefcase, ListsManager],
  ['website', 'Website', Palette, SiteEditor],
  ['store', 'Store', Shirt, StoreManager],
  ['orders', 'Orders', Package, OrderManager],
  ['chat', 'Chat', MessageSquare, ChatManager],
  ['messages', 'Messages', Mail, MessagesManager],
  ['settings', 'Settings', Settings, SettingsManager],
];

export default function AdminDashboard() {
  useDesktopViewport();
  const { isAdmin, loading, logout } = useAuth();
  const { content: c } = useSite();
  const [tab, setTab] = useState(() => (tabs.find((t) => t[0] === window.location.hash.slice(1)) ? window.location.hash.slice(1) : 'dashboard'));
  const orders = useCol('orders');
  const messages = useCol('messages');

  useEffect(() => { window.history.replaceState(null, '', '#' + tab); }, [tab]);

  if (loading) return <p className="p-10 text-center">Loading…</p>;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const newMessages = messages.filter((m) => m.status === 'New').length;
  const alerts = pendingOrders + newMessages;
  const Active = tabs.find((t) => t[0] === tab)[3];
  const initials = c.siteName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const badge = { orders: pendingOrders, messages: newMessages };

  return (
    <div className="min-h-screen flex" style={{ '--accent': '#94505F', '--font': "'Cormorant Garamond'" }}>
      <aside className="w-64 shrink-0 bg-plum text-white p-5 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-8">
          {c.logoUrl ? <img src={c.logoUrl} alt="" className="h-9 w-9 object-contain" /> : <span className="font-display text-4xl font-light">{initials}</span>}
          <span className="text-sm text-white/90 leading-tight">{c.siteName}</span>
        </div>
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {tabs.map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left ${tab === key ? 'bg-white/15' : 'hover:bg-white/10 text-white/80'}`}>
              <Icon size={18} /> <span className="flex-1">{label}</span>
              {badge[key] > 0 && <span className="bg-accent text-white text-[11px] rounded-full px-2">{badge[key]}</span>}
            </button>
          ))}
        </nav>
        <Link to="/" className="flex items-center gap-2 text-sm text-white/70 hover:text-white mb-3"><ExternalLink size={16} /> View website</Link>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-white/70 hover:text-white"><LogOut size={16} /> Logout</button>
      </aside>

      <div className="flex-1 min-w-0 bg-[#F6F4F6]">
        <div className="h-16 bg-white border-b border-ink/10 flex items-center justify-end gap-5 px-8">
          <button className="relative" onClick={() => setTab(pendingOrders ? 'orders' : 'messages')} aria-label="Notifications">
            <Bell size={20} />
            {alerts > 0 && <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] rounded-full h-4 min-w-4 px-1 grid place-items-center">{alerts}</span>}
          </button>
          <span className="flex items-center gap-2 text-sm">
            <span className="h-8 w-8 rounded-full bg-accent text-white grid place-items-center text-xs">A</span> Admin
          </span>
        </div>
        <main className="p-8 max-w-6xl">
          <Active go={setTab} orders={orders} messages={messages} />
        </main>
      </div>
    </div>
  );
}
