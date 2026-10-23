import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import UserRoute from './components/UserRoute';
import OrderWatcher from './components/OrderWatcher';
import Home from './pages/Home';
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
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
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
