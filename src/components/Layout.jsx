import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const home = useLocation().pathname === '/';
  return (
    <>
      <Navbar />
      <main className={home ? '' : 'pt-16 min-h-[70vh]'}><Outlet /></main>
      {!home && <Footer />}
    </>
  );
}
