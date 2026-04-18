import { useState, useEffect, useRef } from 'react';
import { birdsAPI, uploadImage } from '../utils/api';

const EMPTY_FORM = {
  name_zh: '', name_en: '', name_scientific: '',
  category: '鳴禽', conservationStatus: '無危',
  description: '', distribution: '',
  habitat: '', funFacts: '', images: '',
};

export default function AdminPage() {
  const [birds, setBirds] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    birdsAPI.getAll({ limit: 100 }).then(({ data }) => setBirds(data.birds));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      habitat: form.habitat.split(',').map((s) => s.trim()).filter(Boolean),
      funFacts: form.funFacts.split('\n').filter(Boolean),
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editId) {
        const { data } = await birdsAPI.update(editId, payload);
        setBirds(birds.map((b) => (b._id === editId ? data : b)));
        setMessage({ text: '✓ 更新成功', type: 'success' });
      } else {
        const { data } = await birdsAPI.create(payload);
        setBirds([data, ...birds]);
        setMessage({ text: '✓ 新增成功', type: 'success' });
      }
      setForm(EMPTY_FORM);
      setEditId(null);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || '操作失敗', type: 'error' });
    }
  };

  const handleEdit = (bird) => {
    setEditId(bird._id);
    setForm({ ...bird, habitat: bird.habitat?.join(', ') || '', funFacts: bird.funFacts?.join('\n') || '', images: bird.images?.join(', ') || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('確定要刪除這筆資料嗎？')) return;
    await birdsAPI.delete(id);
    setBirds(birds.filter((b) => b._id !== id));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      const existing = form.images ? form.images + ', ' + url : url;
      setForm({ ...form, images: existing });
      setMessage({ text: '✓ 圖片上傳成功', type: 'success' });
    } catch {
      setMessage({ text: '圖片上傳失敗', type: 'error' });
    } finally {
      setUploading(false);
      fileRef.current.value = '';
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none";
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
  const focusStyle = (e) => e.target.style.border = '1px solid rgba(123,97,255,0.5)';
  const blurStyle = (e) => e.target.style.border = '1px solid rgba(255,255,255,0.08)';

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-10">
          <p className="text-brand-purple text-sm font-semibold mb-2 tracking-widest uppercase">Admin</p>
          <h1 className="text-5xl font-black text-white">後台管理</h1>
        </div>

        {/* Form */}
        <div className="glass-card p-6 mb-8">
          <h2 className="font-bold text-xl text-white mb-6">{editId ? '✏️ 編輯鳥類' : '➕ 新增鳥類'}</h2>

          {message.text && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm"
              style={message.type === 'success'
                ? { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ADE80' }
                : { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#F87171' }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[['name_zh', '中文名 *'], ['name_en', '英文名 *'], ['name_scientific', '學名 *'], ['distribution', '分布地區']].map(([field, label]) => (
              <div key={field}>
                <label className="block text-xs font-medium text-brand-muted mb-2 uppercase tracking-wider">{label}</label>
                <input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className={inputClass} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
                  required={label.includes('*')} />
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-brand-muted mb-2 uppercase tracking-wider">分類</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass} style={inputStyle}>
                {['猛禽', '水鳥', '鳴禽', '攀禽', '走禽', '其他'].map((c) => <option key={c} style={{ background: '#13141F' }}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-muted mb-2 uppercase tracking-wider">保育狀態</label>
              <select value={form.conservationStatus} onChange={(e) => setForm({ ...form, conservationStatus: e.target.value })}
                className={inputClass} style={inputStyle}>
                {['無危', '近危', '易危', '瀕危', '極危', '野外絕滅', '絕滅'].map((s) => <option key={s} style={{ background: '#13141F' }}>{s}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-brand-muted mb-2 uppercase tracking-wider">介紹 *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputClass} h-28 resize-none`} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} required />
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-muted mb-2 uppercase tracking-wider">棲息地（逗號分隔）</label>
              <input value={form.habitat} onChange={(e) => setForm({ ...form, habitat: e.target.value })}
                placeholder="山林, 濕地, 草原" className={inputClass} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-muted mb-2 uppercase tracking-wider">上傳圖片</label>
              <div className="flex gap-2 items-center">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload}
                  className="hidden" id="img-upload" />
                <label htmlFor="img-upload"
                  className="cursor-pointer px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
                  style={{ background: uploading ? 'rgba(123,97,255,0.1)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: uploading ? '#9B8AFB' : '#fff' }}>
                  {uploading ? '⏳ 上傳中...' : '📁 選擇圖片'}
                </label>
                <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })}
                  placeholder="或直接貼上圖片 URL"
                  className={`flex-1 ${inputClass}`} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              {form.images && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.images.split(',').map((url, i) => url.trim() && (
                    <img key={i} src={url.trim()} alt="" className="h-16 w-16 object-cover rounded-lg border border-brand-border" />
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-brand-muted mb-2 uppercase tracking-wider">趣味小知識（每行一則）</label>
              <textarea value={form.funFacts} onChange={(e) => setForm({ ...form, funFacts: e.target.value })}
                className={`${inputClass} h-20 resize-none`} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary px-8">{editId ? '更新' : '新增'}</button>
              {editId && (
                <button type="button" onClick={() => { setForm(EMPTY_FORM); setEditId(null); }} className="btn-ghost">取消</button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-border">
            <h2 className="font-bold text-white">所有鳥類 ({birds.length})</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['中文名', '分類', '保育狀態', ''].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {birds.map((bird) => (
                <tr key={bird._id} className="hover:bg-white/02 transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-6 py-4 font-medium text-white text-sm">{bird.name_zh}</td>
                  <td className="px-6 py-4"><span className="tag">{bird.category}</span></td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{bird.conservationStatus}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(bird)} className="text-brand-purple text-sm hover:underline mr-4">編輯</button>
                    <button onClick={() => handleDelete(bird._id)} className="text-red-400 text-sm hover:underline">刪除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
