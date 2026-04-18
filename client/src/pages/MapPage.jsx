import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { birdsAPI } from '../utils/api';

delete L.Icon.Default.prototype._getIconUrl;

// 每種鳥的棲地座標（可多個點）
const BIRD_LOCATIONS = {
  '冠羽畫眉': [{ lat: 24.36, lng: 121.20, site: '合歡山' }, { lat: 23.47, lng: 120.96, site: '玉山' }],
  '台灣紫嘯鶇': [{ lat: 24.15, lng: 121.62, site: '太魯閣' }, { lat: 25.17, lng: 121.56, site: '陽明山' }],
  '台灣藍鵲': [{ lat: 25.17, lng: 121.56, site: '陽明山' }, { lat: 24.85, lng: 121.55, site: '坪林' }],
  '帝雉': [{ lat: 23.47, lng: 120.96, site: '玉山' }, { lat: 24.36, lng: 121.20, site: '合歡山' }],
  '栗背林鴝': [{ lat: 24.36, lng: 121.20, site: '合歡山' }, { lat: 23.47, lng: 120.96, site: '玉山' }],
  '深山竹雞': [{ lat: 24.85, lng: 121.55, site: '坪林' }, { lat: 23.80, lng: 120.80, site: '阿里山' }],
  '火冠戴菊鳥': [{ lat: 24.36, lng: 121.20, site: '合歡山' }, { lat: 23.47, lng: 120.96, site: '玉山' }],
  '烏頭翁': [{ lat: 23.99, lng: 121.60, site: '花蓮' }, { lat: 22.75, lng: 121.15, site: '台東' }],
  '白耳畫眉': [{ lat: 23.80, lng: 120.80, site: '阿里山' }, { lat: 24.36, lng: 121.20, site: '合歡山' }],
  '紋翼畫眉': [{ lat: 24.36, lng: 121.20, site: '合歡山' }, { lat: 24.15, lng: 121.62, site: '太魯閣' }],
  '藍腹鷴': [{ lat: 24.15, lng: 121.62, site: '太魯閣' }, { lat: 23.80, lng: 120.80, site: '阿里山' }],
  '金翼白眉': [{ lat: 24.36, lng: 121.20, site: '合歡山' }, { lat: 23.47, lng: 120.96, site: '玉山' }],
  '黃胸藪眉': [{ lat: 23.80, lng: 120.80, site: '阿里山' }, { lat: 24.85, lng: 121.55, site: '坪林' }],
};

// 聚集地點資訊
const SITES = {
  '陽明山': { lat: 25.17, lng: 121.56 },
  '坪林': { lat: 24.85, lng: 121.55 },
  '太魯閣': { lat: 24.15, lng: 121.62 },
  '合歡山': { lat: 24.36, lng: 121.20 },
  '阿里山': { lat: 23.80, lng: 120.80 },
  '玉山': { lat: 23.47, lng: 120.96 },
  '花蓮': { lat: 23.99, lng: 121.60 },
  '台東': { lat: 22.75, lng: 121.15 },
};

const HABITAT_COLOR = {
  '高海拔': '#FC72FF',
  '中高海拔': '#9B8AFB',
  '中海拔': '#4C82FB',
  '中低海拔': '#4ADE80',
  '低海拔': '#FACC15',
  '東部': '#FB923C',
};

function createBirdIcon(imageUrl, color = '#7B61FF') {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:48px; height:48px; border-radius:50%;
        border:3px solid ${color};
        overflow:hidden;
        box-shadow:0 0 16px ${color}88;
        background:#13141F;
        cursor:pointer;
      ">
        <img src="${imageUrl}" style="width:100%;height:100%;object-fit:cover;" />
      </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
}

function createSiteIcon(count) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:40px; height:40px; border-radius:12px;
        background:linear-gradient(135deg,#FC72FF,#7B61FF);
        display:flex; align-items:center; justify-content:center;
        color:white; font-weight:800; font-size:15px;
        box-shadow:0 0 20px rgba(123,97,255,0.5);
        cursor:pointer;
      ">${count}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 11, { duration: 1.2 });
  }, [center, map]);
  return null;
}

export default function MapPage() {
  const [birds, setBirds] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null);
  const [viewMode, setViewMode] = useState('site'); // 'site' | 'bird'

  useEffect(() => {
    birdsAPI.getAll({ limit: 100 }).then(({ data }) => setBirds(data.birds));
  }, []);

  // 建立地點 → 鳥類的對應
  const siteMap = {};
  birds.forEach((bird) => {
    const locs = BIRD_LOCATIONS[bird.name_zh] || [];
    locs.forEach(({ site }) => {
      if (!siteMap[site]) siteMap[site] = [];
      if (!siteMap[site].find((b) => b._id === bird._id)) {
        siteMap[site].push(bird);
      }
    });
  });

  const handleSiteClick = (site) => {
    setSelectedSite(site);
    const coords = SITES[site];
    if (coords) setFlyTarget([coords.lat, coords.lng]);
  };

  return (
    <div className="pt-20 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-6 w-full">
        <div className="mb-6">
          <p className="text-brand-purple text-sm font-semibold mb-1 tracking-widest uppercase">Distribution Map</p>
          <h1 className="text-4xl font-black text-white">棲地互動地圖</h1>
          <p className="text-brand-muted mt-1 text-sm">點擊地圖標記或左側地點，探索各棲地的特有種鳥類</p>
        </div>

        {/* View mode toggle */}
        <div className="flex gap-2 mb-4">
          {[['site', '📍 依地點'], ['bird', '🦜 依鳥種']].map(([mode, label]) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={viewMode === mode
                ? { background: 'linear-gradient(135deg,#FC72FF,#7B61FF)', color: 'white' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#5D6785' }}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-4 h-[580px]">
          {/* Sidebar */}
          <div className="w-64 shrink-0 flex flex-col gap-2 overflow-y-auto pr-1"
            style={{ scrollbarWidth: 'thin' }}>
            {viewMode === 'site' ? (
              Object.entries(siteMap).map(([site, siteBirds]) => (
                <button key={site} onClick={() => handleSiteClick(site)}
                  className="glass-card p-3 text-left transition-all hover:-translate-y-0.5"
                  style={selectedSite === site ? { border: '1px solid rgba(123,97,255,0.5)', boxShadow: '0 0 20px rgba(123,97,255,0.2)' } : {}}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">{site}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(123,97,255,0.2)', color: '#9B8AFB' }}>
                      {siteBirds.length} 種
                    </span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {siteBirds.slice(0, 4).map((b) => (
                      <img key={b._id} src={b.images?.[0]} alt={b.name_zh}
                        className="w-8 h-8 rounded-lg object-cover"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
                    ))}
                    {siteBirds.length > 4 && (
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-brand-muted"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        +{siteBirds.length - 4}
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              birds.map((bird) => (
                <button key={bird._id}
                  onClick={() => {
                    const locs = BIRD_LOCATIONS[bird.name_zh];
                    if (locs?.[0]) {
                      setFlyTarget([locs[0].lat, locs[0].lng]);
                      setSelectedSite(locs[0].site);
                    }
                  }}
                  className="glass-card p-3 text-left flex items-center gap-3 transition-all hover:-translate-y-0.5">
                  <img src={bird.images?.[0]} alt={bird.name_zh}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm truncate">{bird.name_zh}</p>
                    <p className="text-xs text-brand-muted truncate italic">{bird.name_scientific}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Map */}
          <div className="flex-1 glass-card overflow-hidden">
            <MapContainer center={[23.8, 121.0]} zoom={8} style={{ height: '100%', width: '100%' }}
              zoomControl={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {flyTarget && <FlyTo center={flyTarget} />}

              {/* Site markers */}
              {Object.entries(siteMap).map(([site, siteBirds]) => {
                const coords = SITES[site];
                if (!coords) return null;
                return (
                  <Marker key={site} position={[coords.lat, coords.lng]}
                    icon={createSiteIcon(siteBirds.length)}
                    eventHandlers={{ click: () => handleSiteClick(site) }}>
                    <Popup>
                      <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '200px' }}>
                        <strong style={{ fontSize: '14px', display: 'block', marginBottom: '10px' }}>
                          📍 {site}
                        </strong>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {siteBirds.map((b) => (
                            <a key={b._id} href={`/birds/${b._id}`}
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#333' }}>
                              <img src={b.images?.[0]} alt={b.name_zh}
                                style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
                              <div>
                                <div style={{ fontWeight: '600', fontSize: '13px' }}>{b.name_zh}</div>
                                <div style={{ fontSize: '11px', color: '#888', fontStyle: 'italic' }}>{b.name_scientific}</div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* Individual bird markers (when bird view mode) */}
              {viewMode === 'bird' && birds.map((bird) =>
                (BIRD_LOCATIONS[bird.name_zh] || []).map(({ lat, lng, site }, i) => (
                  <Marker key={`${bird._id}-${i}`} position={[lat, lng]}
                    icon={createBirdIcon(bird.images?.[0], '#7B61FF')}>
                    <Popup>
                      <div style={{ fontFamily: 'Inter, sans-serif', width: '180px' }}>
                        <img src={bird.images?.[0]} alt={bird.name_zh}
                          style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                        <strong style={{ display: 'block', fontSize: '14px' }}>{bird.name_zh}</strong>
                        <span style={{ fontSize: '11px', color: '#888', fontStyle: 'italic' }}>{bird.name_scientific}</span>
                        <br />
                        <span style={{ fontSize: '11px', color: '#666' }}>📍 {site}</span>
                        <br />
                        <a href={`/birds/${bird._id}`}
                          style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', color: '#7B61FF', fontWeight: '600' }}>
                          查看詳情 →
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))
              )}
            </MapContainer>
          </div>
        </div>

        {/* Selected site detail */}
        {selectedSite && siteMap[selectedSite] && (
          <div className="mt-6 glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-white">📍 {selectedSite} — {siteMap[selectedSite].length} 種特有鳥類</h2>
              <button onClick={() => setSelectedSite(null)} className="text-brand-muted hover:text-white text-sm">關閉 ✕</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {siteMap[selectedSite].map((bird) => (
                <Link key={bird._id} to={`/birds/${bird._id}`}
                  className="group flex flex-col items-center p-3 rounded-xl transition-all hover:-translate-y-1"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => e.currentTarget.style.border = '1px solid rgba(123,97,255,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'}>
                  <img src={bird.images?.[0]} alt={bird.name_zh}
                    className="w-16 h-16 rounded-xl object-cover mb-2"
                    style={{ border: '2px solid rgba(255,255,255,0.1)' }} />
                  <p className="text-xs font-bold text-white text-center">{bird.name_zh}</p>
                  <p className="text-xs text-brand-muted text-center mt-0.5 italic truncate w-full text-center">{bird.name_en}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
