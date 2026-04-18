import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { birdsAPI } from '../utils/api';
import BirdCard from '../components/birds/BirdCard';

const CATEGORIES = ['全部', '猛禽', '水鳥', '鳴禽', '攀禽', '走禽', '其他'];

export default function BirdsPage() {
  const [birds, setBirds] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (search) params.search = search;
    if (category && category !== '全部') params.category = category;

    birdsAPI.getAll(params).then(({ data }) => {
      setBirds(data.birds);
      setTotal(data.total);
      setLoading(false);
    });
  }, [search, category, page]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== '全部') next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
    setPage(1);
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <p className="text-brand-purple text-sm font-semibold mb-2 tracking-widest uppercase">Collection</p>
          <h1 className="text-5xl font-black text-white mb-2">鳥類圖鑑</h1>
          <p className="text-brand-muted">共 {total} 幅電繪作品</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => {
            const active = (category || '全部') === cat;
            return (
              <button key={cat} onClick={() => setFilter('category', cat)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={active
                  ? { background: 'linear-gradient(135deg, #FC72FF, #7B61FF)', color: 'white', boxShadow: '0 0 20px rgba(252,114,255,0.3)' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#5D6785' }
                }
                onMouseEnter={e => !active && (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => !active && (e.currentTarget.style.color = '#5D6785')}>
                {cat}
              </button>
            );
          })}

          {search && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
              style={{ background: 'rgba(252,114,255,0.1)', border: '1px solid rgba(252,114,255,0.25)', color: '#FC72FF' }}>
              搜尋：{search}
              <button onClick={() => setFilter('search', '')} className="opacity-70 hover:opacity-100 ml-1">✕</button>
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
          </div>
        ) : birds.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-gray-400">找不到符合的鳥類</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {birds.map((bird) => <BirdCard key={bird._id} bird={bird} />)}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className="w-10 h-10 rounded-xl text-sm font-medium transition-all"
                    style={p === page
                      ? { background: 'linear-gradient(135deg, #FC72FF, #7B61FF)', color: 'white' }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#5D6785' }}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
