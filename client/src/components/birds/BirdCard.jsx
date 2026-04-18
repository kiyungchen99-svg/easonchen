import { Link } from 'react-router-dom';

const statusConfig = {
  '無危': { label: '無危', color: '#4ADE80', bg: 'rgba(74,222,128,0.1)' },
  '近危': { label: '近危', color: '#FACC15', bg: 'rgba(250,204,21,0.1)' },
  '易危': { label: '易危', color: '#FB923C', bg: 'rgba(251,146,60,0.1)' },
  '瀕危': { label: '瀕危', color: '#F87171', bg: 'rgba(248,113,113,0.1)' },
  '極危': { label: '極危', color: '#FC72FF', bg: 'rgba(252,114,255,0.1)' },
};

export default function BirdCard({ bird }) {
  const status = statusConfig[bird.conservationStatus] || { label: bird.conservationStatus, color: '#9B8AFB', bg: 'rgba(155,138,251,0.1)' };

  return (
    <Link to={`/birds/${bird._id}`} className="group block glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ '--hover-glow': '0 0 0 1px rgba(123,97,255,0.4), 0 20px 60px rgba(0,0,0,0.6)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 0 1px rgba(123,97,255,0.3), 0 20px 60px rgba(0,0,0,0.6)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>

      <div className="relative h-52 overflow-hidden bg-brand-card">
        {bird.images?.[0] ? (
          <img src={bird.images[0]} alt={bird.name_zh}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl"
            style={{ background: 'linear-gradient(135deg, rgba(123,97,255,0.15), rgba(76,130,251,0.08))' }}>
            🦜
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />

        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ color: status.color, background: status.bg, border: `1px solid ${status.color}30` }}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-white mb-0.5 group-hover:gradient-text transition-all">{bird.name_zh}</h3>
        <p className="text-xs text-brand-muted italic mb-3">{bird.name_scientific}</p>
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4">{bird.description}</p>
        <span className="tag">{bird.category}</span>
      </div>
    </Link>
  );
}
