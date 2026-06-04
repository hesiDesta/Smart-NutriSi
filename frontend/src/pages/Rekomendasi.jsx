import logoImg from '../assets/logo.png';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, toDateKey } from '../services/api';

/* ── Icons ─────────────────────────────────────── */
const BackIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const BrainIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f2658f" strokeWidth="1.8"><path d="M12 5C8 5 5 8 5 11c0 1.5.5 3 2 4l-1 4h12l-1-4c1.5-1 2-2.5 2-4 0-3-3-6-7-6z"/><path d="M9 11c0-1.1.9-2 2-2M14 9c.6.3 1 .9 1 1.5" strokeLinecap="round"/></svg>;
const SparkIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#f2658f"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>;
const HomeIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const ClockIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 7v5l3 3"/></svg>;
const MenuIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
const PersonIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;
const PlusIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const CheckIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;

const stickerShadow = `3px 3px 0px #ffcecf,-3px -3px 0px #ffcecf,3px -3px 0px #ffcecf,-3px 3px 0px #ffcecf,0px 4px 0px #ffcecf,0px -4px 0px #ffcecf,4px 0px 0px #ffcecf,-4px 0px 0px #ffcecf`;

/* ── Data ───────────────────────────────────────── */
const MEAL_TABS = [
  { label:'Sarapan',     emoji:'🌅' },
  { label:'Cemilan',     emoji:'🍎' },
  { label:'Makan Siang', emoji:'☀️' },
  { label:'Makan Malam', emoji:'🌙' },
];

/* ── Bottom Nav ─────────────────────────────────── */
function BottomNav({ active = 2, onSelect }) {
  const items = [HomeIcon, ClockIcon, MenuIcon, PersonIcon];
  return (
    <div className="flex justify-center">
      <div className="bg-[#f2658f] rounded-full px-2.5 py-2 flex items-center gap-1.5 shadow-xl">
        {items.map((Icon, i) => (
          <button key={i} onClick={() => onSelect?.(i)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
              ${i===active ? 'bg-white text-[#f2658f] shadow' : 'text-white/90 hover:text-white'}`}>
            <Icon />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Rec Card ───────────────────────────────────── */
function RecCard({ rec, added, onAdd, onClick }) {
  const getFoodEmoji = (tags) => {
    const combined = (tags || []).join(' ').toLowerCase();
    if (combined.includes('buah') || combined.includes('pisang')) return '🍎';
    if (combined.includes('sayur') || combined.includes('bayam') || combined.includes('wortel')) return '🥦';
    if (combined.includes('kacang')) return '🥜';
    if (combined.includes('daging') || combined.includes('sapi')) return '🥩';
    if (combined.includes('ikan') || combined.includes('seafood') || combined.includes('abon')) return '🐟';
    if (combined.includes('telur')) return '🥚';
    if (combined.includes('suku') || combined.includes('susu')) return '🥛';
    return '🍲';
  };

  return (
    <div onClick={onClick}
         className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col h-full">
      {/* Color strip + image */}
      <div className="relative h-14 flex-shrink-0" style={{backgroundColor: rec.bg || '#F89EBD'}}>
        <div className="absolute -top-3 right-3 w-14 h-14 rounded-full bg-white/30 flex items-center justify-center text-3xl z-10 select-none shadow-sm">
          {getFoodEmoji(rec.tags)}
        </div>
      </div>
      <div className="px-4 pt-3 pb-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="font-bold text-gray-800 text-[13px] leading-snug pr-2 line-clamp-2">{rec.name || rec.nama}</p>
            <button onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                          transition-all shadow-sm text-white
                          ${added ? 'bg-[#22C55E]' : 'bg-[#f2658f] hover:bg-[#d94876] hover:scale-110 active:scale-95'}`}>
              {added ? <CheckIcon /> : <PlusIcon />}
            </button>
          </div>
          <div className="flex gap-2 mb-2.5">
            <span className="text-[11px] text-gray-500">{rec.kkal || rec.energi_kal || 0} kkal</span>
            <span className="text-gray-300">·</span>
            <span className="text-[11px] text-gray-500">{rec.protein || rec.protein_g || 0}g protein</span>
          </div>
          {/* Why card */}
          {rec.why && (
            <div className="bg-amber-50 rounded-xl px-3 py-2 mb-2.5">
              <p className="text-[11px] text-amber-800 leading-relaxed line-clamp-3">
                <span className="font-bold">💡 Klasifikasi AI: </span>{rec.why}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-auto">
          {(rec.tags || []).map((t,i) => (
            <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-[#f2658f]">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── FORMATTED MENU RENDERER ───────────────────── */
function renderFormattedMenu(text) {
  if (!text) return null;
  
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let cleanLine = line.trim();
    if (!cleanLine) return <div key={idx} className="h-2" />;
    
    // Check if it's a heading like "1. **Contoh Menu**" or "**1. Contoh Menu**"
    const headingMatch = cleanLine.match(/^(?:\*\*)?(\d+\.\s+)?\*\*(.*?)\*\*(?:\*\*)?$/) || cleanLine.match(/^(\d+\.\s+)?\*\*(.*?)\*\*$/);
    if (headingMatch) {
      const num = headingMatch[1] || '';
      const title = headingMatch[2];
      return (
        <h3 key={idx} className="font-bold text-gray-800 text-[13px] mt-4 mb-2 flex items-center gap-1">
          {num && <span className="text-[#f2658f]">{num}</span>}
          <span>{title}</span>
        </h3>
      );
    }
    
    // Check if it is a bullet point: "*   **Protein Hewani (Wajib):** ..." or "*   **Text:**" or similar
    if (cleanLine.startsWith('*') || cleanLine.startsWith('-')) {
      let content = cleanLine.substring(1).trim();
      
      // Parse bold inside bullet point
      const boldParts = content.split('**');
      if (boldParts.length >= 3) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-4 my-1.5 text-[11px] leading-relaxed text-gray-700">
            <span className="text-[#f2658f] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#f2658f]" />
            <p>
              <strong className="text-gray-800 font-semibold">{boldParts[1]}</strong>
              {boldParts.slice(2).join('')}
            </p>
          </div>
        );
      }
      
      return (
        <div key={idx} className="flex items-start gap-2 ml-4 my-1.5 text-[11px] leading-relaxed text-gray-700">
          <span className="text-[#f2658f] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#f2658f]" />
          <p>{content}</p>
        </div>
      );
    }
    
    // Default text line
    const boldParts = cleanLine.split('**');
    if (boldParts.length >= 3) {
      return (
        <p key={idx} className="text-[11px] text-gray-700 leading-relaxed my-1">
          {boldParts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-gray-800 font-semibold">{part}</strong> : part)}
        </p>
      );
    }
    
    return (
      <p key={idx} className="text-[11px] text-gray-700 leading-relaxed my-1">
        {cleanLine}
      </p>
    );
  });
}

/* ── RECIPE DETAIL MODAL ─────────────────────────── */
function RecipeModal({ rec, onClose, onAdd, added, loadingPrediction }) {
  if (!rec) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Content Sheet */}
      <div className="relative bg-white rounded-t-[28px] sm:rounded-[28px] w-full sm:max-w-2xl
                      h-[80vh] sm:h-auto max-h-[85vh] flex flex-col
                      p-6 shadow-2xl anim-slide-up z-10 overflow-hidden">
        
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#f2658f] bg-pink-50 px-2 py-0.5 rounded-full">
              Informasi Nutrisi Makanan
            </span>
            <h2 className="text-gray-800 font-bold text-[18px] mt-1">{rec.name || rec.nama}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-5">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-[#FFF7CC] rounded-2xl p-2.5 text-center">
              <p className="text-[10px] font-bold text-gray-500">Energi</p>
              <p className="text-[13px] font-bold text-[#b45309] mt-0.5">{rec.kkal || rec.energi_kal || 0} kkal</p>
            </div>
            <div className="bg-[#FFE4EC] rounded-2xl p-2.5 text-center">
              <p className="text-[10px] font-bold text-gray-500">Protein</p>
              <p className="text-[13px] font-bold text-[#f2658f] mt-0.5">{rec.protein || rec.protein_g || 0} g</p>
            </div>
            <div className="bg-[#E0F3FF] rounded-2xl p-2.5 text-center">
              <p className="text-[10px] font-bold text-gray-500">Kalsium</p>
              <p className="text-[13px] font-bold text-[#2563eb] mt-0.5">{rec.kalsium || rec.kalsium_mg || 0} mg</p>
            </div>
            <div className="bg-[#E7F8E7] rounded-2xl p-2.5 text-center">
              <p className="text-[10px] font-bold text-gray-500">Zat Besi</p>
              <p className="text-[13px] font-bold text-[#16a34a] mt-0.5">{rec.zatBesi || rec.besi_mg || 0} mg</p>
            </div>
          </div>

          {/* AI Matching Info */}
          {loadingPrediction ? (
            <div className="bg-pink-50/50 rounded-2xl px-4 py-4 border border-pink-100 flex items-center gap-3 justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-[#f2658f] animate-spin" />
              <p className="text-[12px] text-gray-500 font-medium">Menganalisis status gizi dengan model AI...</p>
            </div>
          ) : rec.aiLabel ? (
            <div className="bg-pink-50/50 rounded-2xl px-4 py-3 border border-pink-100 flex items-center gap-3">
              <span className="text-[26px]">🤖</span>
              <div>
                <p className="text-[13px] font-bold text-gray-800">Evaluasi Gizi AI: <span className="text-[#f2658f] font-extrabold">{rec.aiLabel}</span></p>
                <p className="text-[11px] text-gray-500 leading-snug mt-0.5">
                  Tingkat keyakinan model: {Math.round((rec.aiConfidence || 0) * 100)}% berdasarkan profil usia & nutrisi anak.
                </p>
              </div>
            </div>
          ) : null}

          {/* Why Card */}
          {(!loadingPrediction && rec.why) && (
            <div className="bg-amber-50 rounded-2xl px-4 py-3.5 border border-amber-100">
              <p className="text-[13px] font-bold text-amber-800 flex items-center gap-1.5">
                <span>💡</span> Rekomendasi Gizi Model AI:
              </p>
              <p className="text-[12px] text-amber-900 leading-relaxed mt-1">
                {rec.why}
              </p>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="flex-shrink-0 pt-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-[16px] border-2 border-gray-100 text-gray-500
                       font-bold text-[14px] hover:bg-gray-50 transition-colors">
            Tutup
          </button>
          <button onClick={() => { onAdd(); onClose(); }}
            className={`flex-1 py-3 rounded-[16px] font-bold text-[14px] text-white transition-colors shadow-md
                        ${added ? 'bg-[#22C55E]' : 'bg-[#f2658f] hover:bg-[#d94876]'}`}>
            {added ? '✓ Terpilih' : '+ Pilih Bahan'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN ────────────────────────────────────────── */
export default function Rekomendasi({ onBack, onNavigate }) {
  const { user } = useAuth();
  const childName = user?.childProfile?.namaAnak || 'Anak';
  const [activeTab, setActiveTab] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [bottomBarHidden, setBottomBarHidden] = useState(false);
  const [activeNav, setActiveNav] = useState(2);

  const [recs, setRecs]                 = useState({});
  const [deficiencies, setDeficiencies] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selectedRec, setSelectedRec]   = useState(null);
  
  const [aiMenuData, setAiMenuData] = useState(null);
  const [aiMenuLoading, setAiMenuLoading] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  // Debounced search for ingredients from database
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await api.searchFoods(searchQuery);
        setSearchResults(res || []);
      } catch (err) {
        console.error('Error searching foods:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load dynamically predicted nutritional status of searched foods when opened in details modal
  useEffect(() => {
    if (selectedRec && !selectedRec.aiLabel) {
      let active = true;
      const getSinglePrediction = async () => {
        setLoadingPrediction(true);
        try {
          const res = await api.predictSingle(selectedRec);
          if (res.success && active) {
            setSelectedRec(prev => {
              if (prev && (prev.id === selectedRec.id || prev.name === selectedRec.name)) {
                return {
                  ...prev,
                  aiLabel: res.data.label,
                  aiConfidence: res.data.confidence,
                  aiProbabilities: res.data.probabilitas,
                  why: res.data.rekomendasi
                };
              }
              return prev;
            });
          }
        } catch (err) {
          console.error('Error getting single prediction:', err);
        } finally {
          if (active) setLoadingPrediction(false);
        }
      };
      getSinglePrediction();
      return () => { active = false; };
    }
  }, [selectedRec]);

  const handleGenerateAiMenu = async () => {
    if (selectedIngredients.length === 0) return;

    setAiMenuLoading(true);
    setAiMenuData(null);
    try {
      const res = await api.generateMenu(selectedIngredients);
      if (res.success) {
        setAiMenuData(res.data);
        // Sembunyikan bottom bar setelah berhasil, supaya hasil tidak tertutup
        setBottomBarHidden(true);
        setTimeout(() => {
          const el = document.getElementById('combined-result-section');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      } else {
        throw new Error('Gagal memproses resep AI.');
      }
    } catch (err) {
      console.error('Error generating AI menu:', err);
      setAiMenuData({ error: err.message || 'Terjadi kesalahan saat memanggil model AI.' });
    } finally {
      setAiMenuLoading(false);
    }
  };

  const toggleAdd = (item) => {
    // Saat user menambah/menghapus bahan, tampilkan kembali bottom bar
    setBottomBarHidden(false);
    setSelectedIngredients(prev => {
      const exists = prev.some(x => x.name === (item.name || item.nama));
      if (exists) {
        return prev.filter(x => x.name !== (item.name || item.nama));
      } else {
        // Map database food object properties to match recommendations format
        const formatted = {
          name: item.name || item.nama,
          kkal: item.kkal || item.energi_kal || 0,
          protein: item.protein || item.protein_g || 0,
          kalsium: item.kalsium || item.kalsium_mg || 0,
          zatBesi: item.zatBesi || item.besi_mg || 0,
          vitC: item.vitC || item.vit_c_mg || 0,
          fat: item.fat || item.lemak_g || 0,
          carbohydrate: item.carbohydrate || item.karbo_g || 0,
          fiber: item.fiber || item.serat_g || 0,
          fosfor: item.fosfor || item.fosfor_mg || 0,
          kalium: item.kalium || item.kalium_mg || 0,
          natrium: item.natrium || item.natrium_mg || 0,
          niasin: item.niasin || item.niasin_mg || 0,
          retinol: item.retinol || item.retinol_mcg || 0,
          riboflavin: item.riboflavin || item.riboflavin_mg || 0,
          seng: item.seng || item.seng_mg || 0,
          thiamin: item.thiamin || item.thiamin_mg || 0,
          ...item
        };
        return [...prev, formatted];
      }
    });
  };

  useEffect(() => {
    let active = true;
    const fetchRecs = async () => {
      try {
        setLoading(true);
        const res = await api.getRecommendations(toDateKey(new Date()));
        if (active) {
          setRecs(res.data.recommendations || {});
          setDeficiencies(res.data.deficiencies || []);
        }
      } catch (err) {
        console.error('Error loading recommendations:', err);
        if (active) setError(err.message || 'Gagal memuat rekomendasi.');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchRecs();
    return () => { active = false; };
  }, []);

  const currentTabName = MEAL_TABS[activeTab].label;
  const currentTabRecs = recs[currentTabName] || [];

  if (loading) {
    return (
      <div className="font-['Poppins'] bg-pink-base min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#f2658f] border-t-transparent animate-spin mb-4" />
        <p className="text-gray-600 font-bold text-[15px] animate-pulse">Menghubungkan ke Model AI...</p>
        <p className="text-gray-400 text-[12px] mt-1">Menganalisis kecocokan menu anak berdasarkan usia...</p>
      </div>
    );
  }

  return (
    <div className="font-['Poppins']">
      {/* ── MOBILE ── */}
      <div className="lg:hidden bg-pink-base min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-5 pt-6 pb-3 flex items-center gap-3 anim-fade-up anim-d0">
          <button onClick={onBack} className="text-gray-600 hover:text-[#f2658f] transition-colors"><BackIcon /></button>
          <h1 className="flex-1 text-center text-[#f2658f] font-bold text-[20px] mr-6">Rekomendasi Menu</h1>
        </div>

        <div className="flex-1 overflow-y-auto pb-44 px-4 flex flex-col gap-4">
          {/* ML Model Badge */}
          <div className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3 anim-scale-in anim-d1">
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center"><BrainIcon /></div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="font-bold text-gray-800 text-[13px]">Model AI Aktif</p>
                <SparkIcon />
              </div>
              <p className="text-gray-500 text-[11px]">Personalisasi berdasarkan profil &amp; defisiensi nutrisi {childName}</p>
            </div>
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full flex-shrink-0 shadow-sm"/>
          </div>

          {/* Deficiency alerts */}
          <div className="flex flex-col gap-2 anim-fade-up anim-d2">
            {deficiencies.map((d, i) => (
              <div key={i} className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
                <span className="text-[20px]">{d.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] font-semibold text-gray-700">{d.label}</span>
                    <span className="text-[11px] font-medium" style={{color:d.color}}>{d.note}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{width:`${d.pct}%`, backgroundColor:d.color}}/>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search Input Database */}
          <div className="flex flex-col gap-2.5 anim-fade-up anim-d2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari bahan makanan dari database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-pink-100 rounded-2xl pl-11 pr-10 py-3 text-[12px] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f2658f] focus:border-transparent shadow-sm transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  ✕
                </button>
              )}
            </div>

            {searchLoading && (
              <div className="flex items-center justify-center py-4 bg-white rounded-2xl shadow-sm border border-pink-50/50">
                <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-[#f2658f] animate-spin mr-2" />
                <span className="text-[11px] text-gray-500 font-medium">Mencari bahan gizi di database...</span>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="bg-white rounded-2xl border border-pink-50 p-4 shadow-sm space-y-3 anim-scale-in">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Hasil Pencarian Bahan</p>
                <div className="grid grid-cols-1 gap-2.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                  {searchResults.map((item) => {
                    const isSelected = selectedIngredients.some(x => x.name === (item.name || item.nama));
                    return (
                      <div key={item.id}
                           onClick={() => setSelectedRec(item)}
                           className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:border-pink-100 hover:bg-pink-50/20 cursor-pointer transition-all">
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="font-bold text-gray-800 text-[12px] truncate">{item.name || item.nama}</p>
                          <div className="flex gap-2 mt-0.5 text-[10px] text-gray-500">
                            <span>{item.kkal || item.energi_kal || 0} kkal</span>
                            <span>·</span>
                            <span>{item.protein || item.protein_g || 0}g protein</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleAdd(item); }}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm text-white flex-shrink-0
                                      ${isSelected ? 'bg-[#22C55E]' : 'bg-[#f2658f] hover:bg-[#d94876]'}`}
                        >
                          {isSelected ? <CheckIcon /> : <PlusIcon />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {searchQuery && searchResults.length === 0 && !searchLoading && (
              <div className="bg-white rounded-2xl p-6 text-center text-gray-400 text-[11px] border border-pink-50 shadow-sm">
                Bahan makanan tidak ditemukan di database.
              </div>
            )}
          </div>

          {/* Meal tabs */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar anim-fade-up anim-d3 mb-3">
            {MEAL_TABS.map((t,i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className={`flex-1 py-2 rounded-full text-[12px] font-semibold
                            whitespace-nowrap transition-all flex-shrink-0
                            ${activeTab===i ? 'bg-[#f2658f] text-white shadow' : 'bg-white text-gray-600 hover:text-[#f2658f]'}`}>
                <span>{t.emoji}</span>{t.label}
              </button>
            ))}
          </div>

          {!searchQuery && (
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-pink-50 flex flex-col items-center gap-2.5">
              <span className="text-4xl">🥗</span>
              <p className="text-gray-700 font-bold text-[13px]">Cari &amp; Racik Bahan Makanan</p>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Cari bahan di kolom pencarian di atas, lalu pilih tombol <span className="text-[#f2658f] font-bold">+</span> untuk meracik menu cerdas AI.
              </p>
            </div>
          )}

          {/* Inline Combined Results Mobile */}
          {aiMenuLoading && (
            <div className="bg-white rounded-3xl p-6 text-center shadow-md flex flex-col items-center border border-pink-100 anim-scale-in my-2">
              <div className="w-8 h-8 rounded-full border-4 border-t-transparent border-[#f2658f] animate-spin mb-3" />
              <p className="text-gray-800 font-bold text-[13px]">Model AI Sedang Meracik Menu...</p>
              <p className="text-gray-400 text-[11px] mt-1">
                Menganalisis status gizi gabungan dan memproses rekomendasi resep...
              </p>
            </div>
          )}

          {aiMenuData && !aiMenuLoading && (
            <div id="combined-result-section" className="bg-white rounded-3xl p-5 shadow-md border border-pink-100 anim-scale-in my-2 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#f2658f] bg-pink-50 px-2 py-0.5 rounded-full">
                    Hasil Racikan Menu Gizi Gabungan
                  </span>
                  <h2 className="text-gray-800 font-bold text-[15px] mt-1">Status Gizi &amp; Menu</h2>
                </div>
                <button onClick={() => setAiMenuData(null)} className="text-gray-400 hover:text-gray-600 text-xs font-semibold">
                  ✕
                </button>
              </div>

              <div>
                <p className="text-gray-500 text-[9px] font-semibold uppercase tracking-wider mb-1">Bahan-bahan Campuran</p>
                <div className="flex flex-wrap gap-1">
                  {aiMenuData.nama_makanan.split(', ').map((name, i) => (
                    <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200/50">
                      🥘 {name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-pink-50/50 rounded-2xl px-3.5 py-3 border border-pink-100 flex items-center gap-2.5">
                <span className="text-[22px]">🤖</span>
                <div>
                  <p className="text-[12px] font-bold text-gray-800">
                    Status Klasifikasi Gizi: <span className="text-[#f2658f] font-extrabold">{aiMenuData.label || 'Cukup'}</span>
                  </p>
                  <p className="text-[10px] text-gray-500 leading-snug mt-0.5">
                    Ditentukan dari model AI kustom berdasarkan akumulasi gizi 16 nutrisi campuran.
                  </p>
                </div>
              </div>

              {aiMenuData.rekomendasi_menu ? (
                <div>
                  <p className="text-gray-800 font-bold text-[12px] mb-2 flex items-center gap-2">
                    <span>📋</span> Resep &amp; Cara Pengolahan
                  </p>
                  <div className="bg-gray-50 rounded-2xl p-4 text-[11px] text-gray-700 leading-relaxed font-sans overflow-x-auto border border-gray-100">
                    {renderFormattedMenu(aiMenuData.rekomendasi_menu)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-2xl">
                  <p className="text-[11px] text-gray-400">Resep detail gabungan tidak tersedia.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {selectedIngredients.length > 0 && !bottomBarHidden && (
          <div className="fixed bottom-24 left-4 right-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-pink-100 flex items-center justify-between anim-scale-in">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-[20px] flex-shrink-0">🤖</span>
              <div className="text-left min-w-0">
                <p className="font-bold text-gray-800 text-[12px]">{selectedIngredients.length} Bahan Terpilih</p>
                <p className="text-gray-500 text-[10px] truncate">{selectedIngredients.map(i => i.name).join(', ')}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={() => setSelectedIngredients([])} className="text-gray-400 hover:text-gray-600 font-bold text-[11px] px-2 py-1">
                Reset
              </button>
              <button onClick={handleGenerateAiMenu}
                      disabled={aiMenuLoading}
                      className="bg-[#f2658f] hover:bg-[#d94876] active:scale-95 text-white font-bold text-[12px] px-3 py-2 rounded-xl transition-all shadow disabled:opacity-60">
                {aiMenuLoading ? 'Meracik...' : 'Buat Menu AI ✨'}
              </button>
              <button onClick={() => setBottomBarHidden(true)}
                      title="Sembunyikan"
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-[12px] font-bold transition-colors">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Tombol munculkan lagi saat bottom bar disembunyikan */}
        {selectedIngredients.length > 0 && bottomBarHidden && (
          <button
            onClick={() => setBottomBarHidden(false)}
            className="fixed bottom-24 right-4 z-40 bg-[#f2658f] hover:bg-[#d94876] text-white rounded-full
                       px-3 py-2 shadow-lg flex items-center gap-1.5 text-[11px] font-bold anim-scale-in">
            <span>🤖</span>
            <span>{selectedIngredients.length} bahan</span>
          </button>
        )}

        {/* Fixed Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 pb-5 pt-2 bg-gradient-to-t from-pink-100/80 to-transparent">
          <BottomNav active={activeNav} onSelect={i => { setActiveNav(i); onNavigate?.(i); }} />
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden lg:flex flex-row h-screen overflow-hidden bg-pink-base">
        <span className="absolute top-10 left-10  text-[#f2658f]/40 text-3xl select-none anim-twinkle pointer-events-none">✦</span>
        <span className="absolute top-40 right-[52%] text-[#f2658f]/30 text-2xl select-none anim-twinkle-b pointer-events-none">✦</span>
        <span className="absolute bottom-20 left-[28%] text-[#f2658f]/35 text-xl select-none anim-twinkle-c pointer-events-none">✦</span>
        <span className="absolute top-[55%] right-12 text-[#f2658f]/25 text-4xl select-none anim-twinkle-d pointer-events-none">✦</span>

        {/* ── KIRI ── */}
        <div className="w-[42%] h-full flex flex-col px-12 xl:px-16 py-8 relative z-10">
          
          {/* Scrollable Upper Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-4">
            {/* Back + Logo */}
            <div className="flex items-center justify-between mb-8 anim-fade-left anim-d0">
              <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-[#f2658f] transition-colors text-[14px] font-medium">
                <BackIcon /> Kembali
              </button>
              <div className="flex items-center gap-2">
                <img src={logoImg} className="w-8 h-8 object-contain rounded-xl shadow-md" alt="NutriSi Logo" />
                <span className="text-[#f2658f] font-bold text-[20px]">NutriSi</span>
              </div>
            </div>

            <h1 className="text-[44px] xl:text-[54px] font-bold mb-4 leading-[48px] xl:leading-[58px]
                           tracking-[-1.5px] text-[#f2658f] italic anim-fade-left anim-d1"
                style={{textShadow:stickerShadow}}>
              <span className="block">Rekomendasi</span>
              <span className="block">Menu</span>
              <span className="block">Cerdas</span>
            </h1>
            <p className="text-gray-600 text-[15px] max-w-[360px] mb-6 leading-relaxed anim-fade-left anim-d2">
              Saran menu dipersonalisasi menggunakan model ML berdasarkan defisiensi nutrisi harian {childName}.
            </p>

            {/* Deficiency lists */}
            <div className="flex flex-col gap-2.5 mb-4">
              {deficiencies.map((d, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-pink-100/60
                                        hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 anim-fade-left"
                     style={{animationDelay:`${(i+3)*80}ms`}}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-bold text-gray-700">{d.emoji} {d.label}</span>
                    <span className="text-[11px] font-bold text-red-500">{d.note}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{width:`${d.pct}%`, backgroundColor:d.color}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom nav */}
          <div className="anim-fade-up anim-d4 pt-4 pb-5">
            <BottomNav active={activeNav} onSelect={i => { setActiveNav(i); onNavigate?.(i); }} />
          </div>
        </div>

        {/* ── KANAN ── */}
        <div className="flex-1 h-full flex flex-col px-10 xl:px-14 py-8 relative z-10 border-l border-gray-100 anim-fade-right anim-d1">
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 no-scrollbar pb-28">
            
            {/* Search Input Database Desktop */}
            <div className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari bahan makanan dari database..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-pink-100 rounded-2xl pl-11 pr-10 py-3.5 text-[13px] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f2658f] focus:border-transparent shadow-sm transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    ✕
                  </button>
                )}
              </div>

              {searchLoading && (
                <div className="flex items-center justify-center py-4 bg-white rounded-2xl shadow-sm border border-pink-50/50">
                  <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-[#f2658f] animate-spin mr-2" />
                  <span className="text-[12px] text-gray-500 font-medium">Mencari bahan gizi di database...</span>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="bg-white rounded-2xl border border-pink-50 p-4 shadow-sm space-y-3 anim-scale-in">
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Hasil Pencarian Bahan</p>
                  <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-1 no-scrollbar">
                    {searchResults.map((item) => {
                      const isSelected = selectedIngredients.some(x => x.name === (item.name || item.nama));
                      return (
                        <div key={item.id}
                             onClick={() => setSelectedRec(item)}
                             className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:border-pink-100 hover:bg-pink-50/20 cursor-pointer transition-all">
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="font-bold text-gray-800 text-[12px] truncate">{item.name || item.nama}</p>
                            <div className="flex gap-2 mt-0.5 text-[10px] text-gray-500">
                              <span>{item.kkal || item.energi_kal || 0} kkal</span>
                              <span>·</span>
                              <span>{item.protein || item.protein_g || 0}g protein</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleAdd(item); }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm text-white flex-shrink-0
                                        ${isSelected ? 'bg-[#22C55E]' : 'bg-[#f2658f] hover:bg-[#d94876]'}`}
                          >
                            {isSelected ? <CheckIcon /> : <PlusIcon />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {searchQuery && searchResults.length === 0 && !searchLoading && (
                <div className="bg-white rounded-2xl p-6 text-center text-gray-400 text-[12px] border border-pink-50 shadow-sm">
                  Bahan makanan tidak ditemukan di database.
                </div>
              )}
            </div>

            {/* Meal tabs */}
            <div className="flex gap-2 mb-4">
              {MEAL_TABS.map((t,i) => (
                <button key={i} onClick={() => setActiveTab(i)}
                  className={`flex-1 py-3 rounded-2xl text-[13px] font-bold transition-all flex items-center justify-center gap-2
                              ${activeTab===i ? 'bg-[#f2658f] text-white shadow-md scale-102' : 'bg-white text-gray-600 hover:text-[#f2658f] border border-gray-100'}`}>
                  <span>{t.emoji}</span>{t.label}
                </button>
              ))}
            </div>

            {!searchQuery && (
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 text-center border border-pink-100/50 shadow-sm flex flex-col items-center gap-3">
                <span className="text-5xl">🥗</span>
                <p className="text-gray-700 font-bold text-[14px]">Cari &amp; Racik Bahan Makanan</p>
                <p className="text-gray-500 text-[12px] max-w-sm leading-relaxed">
                  Cari bahan gizi di kolom pencarian di atas, lalu pilih tombol <span className="text-[#f2658f] font-bold">+</span> untuk memasukkannya ke dalam racikan menu cerdas AI anak.
                </p>
              </div>
            )}

            {/* Inline Combined Results Desktop inside scroll list */}
            {aiMenuLoading && (
              <div className="bg-white rounded-3xl p-8 text-center shadow-md flex flex-col items-center border border-pink-100 anim-scale-in">
                <div className="w-10 h-10 rounded-full border-4 border-t-transparent border-[#f2658f] animate-spin mb-4" />
                <p className="text-gray-800 font-bold text-[14px]">Model AI Sedang Meracik Menu...</p>
                <p className="text-gray-400 text-[11px] mt-1">
                  Menganalisis status gizi gabungan dan memproses rekomendasi resep MPASI...
                </p>
              </div>
            )}

            {aiMenuData && !aiMenuLoading && (
              <div id="combined-result-section" className="bg-white rounded-3xl p-6 shadow-md border border-pink-100 anim-scale-in flex flex-col gap-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#f2658f] bg-pink-50 px-2 py-0.5 rounded-full">
                      Hasil Racikan Menu Gizi Gabungan
                    </span>
                    <h2 className="text-gray-800 font-bold text-[16px] mt-1">Status Gizi &amp; Rekomendasi Menu</h2>
                  </div>
                  <button onClick={() => setAiMenuData(null)} className="text-gray-400 hover:text-gray-600 text-xs font-semibold">
                    Sembunyikan
                  </button>
                </div>

                <div>
                  <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-2">Bahan-bahan Campuran</p>
                  <div className="flex flex-wrap gap-1.5">
                    {aiMenuData.nama_makanan.split(', ').map((name, i) => (
                      <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200/50">
                        🥘 {name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-pink-50/50 rounded-2xl px-4 py-3 border border-pink-100 flex items-center gap-3">
                  <span className="text-[26px]">🤖</span>
                  <div>
                    <p className="text-[13px] font-bold text-gray-800">
                      Status Klasifikasi Gizi: <span className="text-[#f2658f] font-extrabold">{aiMenuData.label || 'Cukup'}</span>
                    </p>
                    <p className="text-[11px] text-gray-500 leading-snug mt-0.5">
                      Diperoleh dari model AI kustom berdasarkan akumulasi gizi 16 nutrisi campuran.
                    </p>
                  </div>
                </div>

                {aiMenuData.rekomendasi_menu ? (
                  <div>
                    <p className="text-gray-800 font-bold text-[13px] mb-2 flex items-center gap-2">
                      <span>📋</span> Rekomendasi Cara Pengolahan
                    </p>
                    <div className="bg-gray-50 rounded-2xl p-4 text-[11px] text-gray-700 leading-relaxed font-sans overflow-x-auto border border-gray-100">
                      {renderFormattedMenu(aiMenuData.rekomendasi_menu)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-gray-200 rounded-2xl">
                    <p className="text-[12px] text-gray-400">Resep detail gabungan tidak tersedia.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop floating selection bar */}
          {selectedIngredients.length > 0 && !bottomBarHidden && (
            <div className="absolute bottom-6 left-10 right-10 z-40 bg-white/95 backdrop-blur-md rounded-3xl px-6 py-4 shadow-xl border border-pink-100 flex items-center justify-between anim-scale-in">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="text-[28px] flex-shrink-0">🤖</span>
                <div className="text-left min-w-0">
                  <p className="font-bold text-gray-800 text-[14px]">{selectedIngredients.length} Bahan Terpilih</p>
                  <p className="text-gray-500 text-[11px] truncate">{selectedIngredients.map(i => i.name).join(', ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => setSelectedIngredients([])} className="text-gray-400 hover:text-gray-600 font-bold text-[13px] px-3 py-2">
                  Reset
                </button>
                <button onClick={handleGenerateAiMenu}
                        disabled={aiMenuLoading}
                        className="bg-[#f2658f] hover:bg-[#d94876] active:scale-95 text-white font-bold text-[13px] px-6 py-3 rounded-2xl transition-all shadow-md disabled:opacity-60">
                  {aiMenuLoading ? 'Meracik...' : 'Buat Menu Cerdas AI ✨'}
                </button>
                <button onClick={() => setBottomBarHidden(true)}
                        title="Sembunyikan"
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold transition-colors">
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Tombol munculkan lagi (desktop) */}
          {selectedIngredients.length > 0 && bottomBarHidden && (
            <button
              onClick={() => setBottomBarHidden(false)}
              className="absolute bottom-8 right-10 z-40 bg-[#f2658f] hover:bg-[#d94876] text-white rounded-full
                         px-4 py-2.5 shadow-lg flex items-center gap-2 text-[12px] font-bold anim-scale-in">
              <span>🤖</span>
              <span>{selectedIngredients.length} bahan terpilih</span>
            </button>
          )}
        </div>
      </div>

      {/* Recipe details modal */}
      {selectedRec && (
        <RecipeModal
          rec={selectedRec}
          onClose={() => setSelectedRec(null)}
          onAdd={() => toggleAdd(selectedRec)}
          added={selectedIngredients.some(x => x.name === (selectedRec.name || selectedRec.nama))}
          loadingPrediction={loadingPrediction}
        />
      )}
    </div>
  );
}