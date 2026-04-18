import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import BirdsPage from './pages/BirdsPage';
import BirdDetailPage from './pages/BirdDetailPage';
import MapPage from './pages/MapPage';
import LoginPage from './pages/LoginPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminPage from './pages/AdminPage';
import useAuthStore from './store/useAuthStore';

function PrivateRoute({ children }) {
  const { user, loading } = useAuthStore();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuthStore();
  if (loading) return null;
  return user?.role === 'admin' ? children : <Navigate to="/" />;
}

export default function App() {
  const { fetchMe } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/birds" element={<BirdsPage />} />
          <Route path="/birds/:id" element={<BirdDetailPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Routes>
      </main>
      <footer className="py-8 text-center text-brand-muted text-sm"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="gradient-text font-semibold text-base mb-1">Taiwan Wild Birds</p>
        <p>© 2024 台灣野鳥電繪畫集 — All illustrations original</p>
      </footer>
    </div>
  );
}
