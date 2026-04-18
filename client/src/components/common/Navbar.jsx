import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ background: 'rgba(13,14,20,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
          style={{ background: 'linear-gradient(135deg, #FC72FF, #7B61FF)' }}>
          🦜
        </div>
        <span className="font-bold text-white tracking-tight">Taiwan Wild Birds</span>
      </Link>

      <div className="flex items-center gap-1">
        {[
          { to: '/birds', label: '圖鑑' },
          { to: '/map', label: '地圖' },
          ...(user ? [{ to: '/favorites', label: '收藏' }] : []),
          ...(user?.role === 'admin' ? [{ to: '/admin', label: '後台' }] : []),
        ].map(({ to, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white bg-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/05'
              }`
            }>
            {label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-gray-400">{user.username}</span>
            <button onClick={handleLogout} className="btn-ghost text-sm">登出</button>
          </>
        ) : (
          <Link to="/login" className="btn-primary text-sm">連接帳號</Link>
        )}
      </div>
    </nav>
  );
}
