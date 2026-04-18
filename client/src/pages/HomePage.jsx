import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { birdsAPI } from '../utils/api';
import BirdCard from '../components/birds/BirdCard';

const STATS = [
  { value: '30+', label: '特有種' },
  { value: '600+', label: '鳥種紀錄' },
  { value: '100%', label: '電繪原創' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    birdsAPI.getAll({ limit: 6 }).then(({ data }) => setFeatured(data.birds));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/birds?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(252,114,255,0.15) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(76,130,251,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(123,97,255,0.1) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
            style={{ background: 'rgba(123,97,255,0.15)', border: '1px solid rgba(123,97,255,0.3)', color: '#9B8AFB' }}>
            <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
            電子繪圖 × 台灣自然生態
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight">
            <span className="text-white">台灣野鳥</span>
            <br />
            <span className="gradient-text">畫集</span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            以電繪之筆，捕捉台灣 30+ 種特有鳥類的靈動瞬間。
            每一幅畫作都是對這片土地生命的深情詮釋。
          </p>

          <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mx-auto mb-16">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜尋鳥類名稱、學名..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-white text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => e.target.style.border = '1px solid rgba(123,97,255,0.5)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
              />
            </div>
            <button type="submit" className="btn-primary px-6">探索</button>
          </form>

          {/* Stats */}
          <div className="flex justify-center gap-12">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-black gradient-text">{value}</p>
                <p className="text-sm text-brand-muted mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-muted text-xs animate-bounce">
          <span>scroll</span>
          <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(155,138,251,0.5), transparent)' }} />
        </div>
      </section>

      {/* Featured Gallery */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-purple text-sm font-semibold mb-2 tracking-widest uppercase">Gallery</p>
            <h2 className="text-4xl font-black text-white">精選畫作</h2>
          </div>
          <Link to="/birds" className="btn-ghost text-sm">
            查看全部 →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((bird) => <BirdCard key={bird._id} bird={bird} />)}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: '🎨',
              title: '電繪原創藝術',
              desc: '每幅作品都是獨一無二的數位繪畫，細膩呈現羽毛紋理與生態神韻',
              gradient: 'from-pink-500/20 to-purple-500/10',
            },
            {
              icon: '🗺️',
              title: '棲地互動地圖',
              desc: '以地圖探索台灣各地的鳥類分布，規劃你的賞鳥路線',
              gradient: 'from-purple-500/20 to-blue-500/10',
            },
            {
              icon: '📖',
              title: '深度生態介紹',
              desc: '結合保育資訊與有趣知識，讓藝術與自然教育完美融合',
              gradient: 'from-blue-500/20 to-cyan-500/10',
            },
          ].map(({ icon, title, desc, gradient }) => (
            <div key={title} className={`glass-card p-8 bg-gradient-to-br ${gradient}`}>
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-bold text-xl text-white mb-3">{title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
