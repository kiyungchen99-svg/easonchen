import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { birdsAPI, usersAPI } from '../utils/api';
import useAuthStore from '../store/useAuthStore';

const statusConfig = {
  '無危': { color: '#4ADE80', label: '無危 (LC)', desc: '族群穩定，目前無滅絕威脅' },
  '近危': { color: '#FACC15', label: '近危 (NT)', desc: '族群有下降趨勢，需持續關注' },
  '易危': { color: '#FB923C', label: '易危 (VU)', desc: '面臨滅絕風險，需積極保育' },
  '瀕危': { color: '#F87171', label: '瀕危 (EN)', desc: '族群極少，滅絕風險高' },
  '極危': { color: '#FC72FF', label: '極危 (CR)', desc: '極度瀕危，需緊急保育行動' },
};

const TABS = ['概覽', '生態習性', '繁殖資訊', '保育威脅', '觀察留言'];

const tagColors = [
  'rgba(252,114,255,0.15)', 'rgba(123,97,255,0.15)',
  'rgba(76,130,251,0.15)', 'rgba(74,222,128,0.15)',
  'rgba(250,204,21,0.15)',
];

export default function BirdDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [bird, setBird] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('概覽');

  useEffect(() => {
    birdsAPI.getById(id).then(({ data }) => setBird(data));
    birdsAPI.getComments(id).then(({ data }) => setComments(data));
  }, [id]);

  useEffect(() => {
    if (user) {
      usersAPI.getFavorites().then(({ data }) => {
        setIsFavorite(data.some((b) => b._id === id));
      });
    }
  }, [user, id]);

  const handleFavorite = async () => {
    const { data } = await usersAPI.toggleFavorite(id);
    setIsFavorite(data.favorites.includes(id));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const { data } = await birdsAPI.addComment(id, newComment);
    setComments([data, ...comments]);
    setNewComment('');
  };

  const handleDeleteComment = async (commentId) => {
    await birdsAPI.deleteComment(commentId);
    setComments(comments.filter((c) => c._id !== commentId));
  };

  if (!bird) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
    </div>
  );

  const status = statusConfig[bird.conservationStatus] || { color: '#9B8AFB', label: bird.conservationStatus, desc: '' };

  return (
    <div className="pt-20 min-h-screen pb-16">
      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {bird.images?.[activeImg] ? (
          <img src={bird.images[activeImg]} alt={bird.name_zh}
            className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-9xl"
            style={{ background: 'linear-gradient(135deg,rgba(123,97,255,0.2),rgba(76,130,251,0.1))' }}>🦜</div>
        )}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #0D0E14 0%, rgba(13,14,20,0.4) 50%, transparent 100%)' }} />

        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {bird.ecologyTags?.map((tag, i) => (
                <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: tagColors[i % tagColors.length], color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">{bird.name_zh}</h1>
            <p className="text-brand-purple italic mt-1">{bird.name_scientific}</p>
          </div>
          {user && (
            <button onClick={handleFavorite}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all shrink-0"
              style={{ background: isFavorite ? 'rgba(252,114,255,0.2)' : 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: `1px solid ${isFavorite ? 'rgba(252,114,255,0.5)' : 'rgba(255,255,255,0.2)'}` }}>
              {isFavorite ? '❤️' : '🤍'}
            </button>
          )}
        </div>

        <Link to="/birds" className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-sm text-white transition-all"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          ← 返回
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        {/* Image thumbnails */}
        {bird.images?.length > 1 && (
          <div className="flex gap-2 mb-6">
            {bird.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className="h-16 w-16 rounded-xl overflow-hidden transition-all"
                style={{ border: i === activeImg ? '2px solid #7B61FF' : '2px solid rgba(255,255,255,0.1)', opacity: i === activeImg ? 1 : 0.6 }}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Quick stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: '📏', label: '體型', value: bird.size || '資料待補充' },
            { icon: '🏔️', label: '海拔範圍', value: bird.altitudeRange || '資料待補充' },
            { icon: '🌿', label: '棲息地', value: bird.habitat?.join('、') || '—' },
            { icon: '🥚', label: '繁殖季', value: bird.breedingSeason || '資料待補充' },
          ].map(({ icon, label, value }) => (
            <div key={label} className="glass-card p-4">
              <p className="text-xl mb-1">{icon}</p>
              <p className="text-xs text-brand-muted mb-1">{label}</p>
              <p className="text-sm text-white font-medium leading-snug">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0"
              style={activeTab === tab
                ? { background: 'linear-gradient(135deg,#FC72FF,#7B61FF)', color: 'white' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#5D6785' }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass-card p-6 mb-6">

          {/* 概覽 */}
          {activeTab === '概覽' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full inline-block" style={{ background: 'linear-gradient(#FC72FF,#7B61FF)' }} />
                  物種介紹
                </h2>
                <p className="text-gray-300 leading-relaxed">{bird.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-3">基本分類</h3>
                  {[
                    ['中文名', bird.name_zh],
                    ['英文名', bird.name_en],
                    ['學名', bird.name_scientific],
                    ['類別', bird.category],
                    ['分布地區', bird.distribution],
                  ].map(([k, v]) => v && (
                    <div key={k} className="flex gap-3 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <span className="text-brand-muted text-sm w-20 shrink-0">{k}</span>
                      <span className="text-white text-sm italic={k==='學名'}">{v}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-3">食性</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bird.diet?.map((d) => (
                      <span key={d} className="text-sm px-3 py-1 rounded-full"
                        style={{ background: 'rgba(76,130,251,0.15)', color: '#93C5FD', border: '1px solid rgba(76,130,251,0.25)' }}>
                        🍽️ {d}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-3">生態標籤</h3>
                  <div className="flex flex-wrap gap-2">
                    {bird.ecologyTags?.map((tag, i) => (
                      <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full"
                        style={{ background: tagColors[i % tagColors.length], color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {bird.funFacts?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-3">趣味小知識</h3>
                  <div className="space-y-2">
                    {bird.funFacts.map((fact, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="gradient-text font-black shrink-0">✦</span>
                        <p className="text-gray-300 text-sm">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 生態習性 */}
          {activeTab === '生態習性' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full inline-block" style={{ background: 'linear-gradient(#FC72FF,#7B61FF)' }} />
                  行為習性
                </h2>
                <p className="text-gray-300 leading-relaxed">{bird.behavior || '資料待補充'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl" style={{ background: 'rgba(76,130,251,0.08)', border: '1px solid rgba(76,130,251,0.15)' }}>
                  <p className="text-brand-blue text-xs font-semibold uppercase tracking-wider mb-2">🏔️ 棲息環境</p>
                  <p className="text-white font-medium mb-1">{bird.altitudeRange || '—'}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {bird.habitat?.map((h) => (
                      <span key={h} className="text-xs px-2 py-0.5 rounded-full text-gray-300"
                        style={{ background: 'rgba(255,255,255,0.06)' }}>{h}</span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                  <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-2">🍽️ 主要食物</p>
                  <div className="flex flex-wrap gap-1.5">
                    {bird.diet?.map((d) => (
                      <span key={d} className="text-sm text-white">{d}</span>
                    )) || <span className="text-gray-400">資料待補充</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 繁殖資訊 */}
          {activeTab === '繁殖資訊' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1 h-5 rounded-full inline-block" style={{ background: 'linear-gradient(#FC72FF,#7B61FF)' }} />
                繁殖生態
              </h2>
              {[
                { icon: '🗓️', label: '繁殖季節', value: bird.breedingSeason },
                { icon: '🪺', label: '築巢方式', value: bird.nestType },
                { icon: '📏', label: '體型資訊', value: bird.size },
              ].map(({ icon, label, value }) => (
                <div key={label} className="p-5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-2xl mb-2">{icon}</p>
                  <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-gray-200 leading-relaxed">{value || '資料待補充'}</p>
                </div>
              ))}
            </div>
          )}

          {/* 保育威脅 */}
          {activeTab === '保育威脅' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full inline-block" style={{ background: 'linear-gradient(#FC72FF,#7B61FF)' }} />
                  保育現況
                </h2>
                <div className="p-5 rounded-2xl mb-6"
                  style={{ background: `${status.color}12`, border: `1px solid ${status.color}30` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-black" style={{ color: status.color }}>{status.label}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{status.desc}</p>
                </div>
              </div>

              {bird.threats?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-3">主要威脅因素</h3>
                  <div className="space-y-2">
                    {bird.threats.map((t, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl items-start"
                        style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
                        <span className="text-red-400 shrink-0 mt-0.5">⚠️</span>
                        <p className="text-gray-300 text-sm">{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 觀察留言 */}
          {activeTab === '觀察留言' && (
            <div>
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full inline-block" style={{ background: 'linear-gradient(#FC72FF,#7B61FF)' }} />
                觀察紀錄
                <span className="text-brand-muted font-normal text-sm ml-1">({comments.length})</span>
              </h2>

              {user ? (
                <form onSubmit={handleComment} className="flex gap-3 mb-6">
                  <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
                    placeholder="分享你的野外觀察紀錄..."
                    maxLength={500}
                    className="flex-1 px-4 py-3 rounded-xl text-sm text-white outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => e.target.style.border = '1px solid rgba(123,97,255,0.5)'}
                    onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}
                  />
                  <button type="submit" className="btn-primary px-5 text-sm shrink-0">送出</button>
                </form>
              ) : (
                <div className="p-4 rounded-xl mb-6 text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-gray-400 text-sm">
                    <Link to="/login" className="text-brand-purple hover:underline font-medium">登入</Link> 後才能留言
                  </p>
                </div>
              )}

              {comments.length === 0 ? (
                <p className="text-center text-brand-muted py-8">還沒有觀察紀錄，成為第一個分享的人！</p>
              ) : (
                <div className="space-y-3">
                  {comments.map((c) => (
                    <div key={c._id} className="flex justify-between items-start p-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        <span className="text-sm font-semibold" style={{ color: '#9B8AFB' }}>{c.user.username}</span>
                        <p className="text-gray-300 text-sm mt-1">{c.content}</p>
                        <p className="text-brand-muted text-xs mt-2">{new Date(c.createdAt).toLocaleDateString('zh-TW')}</p>
                      </div>
                      {(user?._id === c.user._id || user?.role === 'admin') && (
                        <button onClick={() => handleDeleteComment(c._id)}
                          className="text-xs text-brand-muted hover:text-red-400 transition-colors ml-4 shrink-0">
                          刪除
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
