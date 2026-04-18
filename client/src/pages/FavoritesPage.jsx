import { useState, useEffect } from 'react';
import { usersAPI } from '../utils/api';
import BirdCard from '../components/birds/BirdCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersAPI.getFavorites().then(({ data }) => {
      setFavorites(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <p className="text-brand-purple text-sm font-semibold mb-2 tracking-widest uppercase">My Collection</p>
          <h1 className="text-5xl font-black text-white">我的收藏</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <p className="text-6xl mb-6">🤍</p>
            <p className="text-xl font-bold text-white mb-2">收藏清單是空的</p>
            <p className="text-brand-muted text-sm">在圖鑑中點擊愛心，收藏你喜愛的鳥類畫作</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favorites.map((bird) => <BirdCard key={bird._id} bird={bird} />)}
          </div>
        )}
      </div>
    </div>
  );
}
