import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import UserRoute from './components/UserRoute';
import OrderWatcher from './components/OrderWatcher';
import VisitTracker from './components/VisitTracker';
import Home from './pages/Home';
import Work from './pages/Work';
import Login from './pages/Login';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <>
      <OrderWatcher />
      <VisitTracker />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/login" element={<Login />} />
          <Route path="/shop" element={<UserRoute><Shop /></UserRoute>} />
          <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
          <Route path="/orders" element={<UserRoute><Orders /></UserRoute>} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
