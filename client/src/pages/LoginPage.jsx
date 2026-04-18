import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || '發生錯誤，請再試一次');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Background */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(252,114,255,0.12) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(76,130,251,0.1) 0%, transparent 70%)' }} />

      <div className="glass-card p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #FC72FF, #7B61FF)' }}>
            🦜
          </div>
          <h1 className="text-2xl font-black text-white">
            {isLogin ? '歡迎回來' : '加入畫集'}
          </h1>
          <p className="text-brand-muted text-sm mt-1">Taiwan Wild Birds Collection</p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400"
            style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-brand-muted mb-2 uppercase tracking-wider">使用者名稱</label>
              <input type="text" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={e => e.target.style.border = '1px solid rgba(123,97,255,0.5)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}
                required />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-2 uppercase tracking-wider">Email</label>
            <input type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => e.target.style.border = '1px solid rgba(123,97,255,0.5)'}
              onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}
              required />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-2 uppercase tracking-wider">密碼</label>
            <input type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => e.target.style.border = '1px solid rgba(123,97,255,0.5)'}
              onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}
              required minLength={6} />
          </div>
          <button type="submit" className="btn-primary w-full py-3.5 text-sm mt-2">
            {isLogin ? '登入' : '建立帳號'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-brand-muted">
          {isLogin ? '還沒有帳號？' : '已有帳號？'}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="ml-2 font-semibold hover:underline" style={{ color: '#9B8AFB' }}>
            {isLogin ? '立即加入' : '返回登入'}
          </button>
        </p>
      </div>
    </div>
  );
}
