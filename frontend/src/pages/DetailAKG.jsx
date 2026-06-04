import logoImg from '../assets/logo.png';
import React, { useState, useEffect, useMemo } from 'react';
import { api, toDateKey } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ── Icons ─────────────────────────────────────── */
const BackIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const InfoIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>;

const stickerShadow = `3px 3px 0px #ffcecf,-3px -3px 0px #ffcecf,3px -3px 0px #ffcecf,-3px 3px 0px #ffcecf,0px 4px 0px #ffcecf,0px -4px 0px #ffcecf,4px 0px 0px #ffcecf,-4px 0px 0px #ffcecf`;

const TABS = ['Hari Ini', 'Minggu Ini', 'Bulan Ini'];

const getStatus = (pct) => {
  if (pct >= 100) return { label: 'Sangat Baik', color: '#22C55E' };
  if (pct >=  80) return { label: 'Baik',        color: '#3B82F6' };
  if (pct >=  50) return { label: 'Cukup',       color: '#F97316' };
  return             { label: 'Rendah',      color: '#EF4444' };
};

/* ── Donut ──────────────────────────────────────── */
function DonutChart({ pct, size = 130, sw = 14 }) {
  const { label, color } = getStatus(pct);
  const r = size/2 - sw - 2, cx = size/2;
  const cir = 2*Math.PI*r, dash = Math.min(pct,100)/100*cir;
  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0" style={{width:size,height:size}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#ECECEC" strokeWidth={sw}/>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${dash} ${cir-dash}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cx})`}/>
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="font-bold" style={{color, fontSize:size*0.165}}>{pct}%</span>
        <span className="font-semibold mt-1 text-center" style={{color:'#888', fontSize:size*0.095}}>{label}</span>
      </div>
    </div>
  );
}

/* ── Nutrient Card ───────────────────────────────── */
function NutriCard({ n, expanded, onToggle }) {
  const pct = Math.round((n.val / n.max) * 100);
  const { label, color } = getStatus(pct);
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-pink-50
                     overflow-hidden transition-all duration-300 cursor-pointer
                     hover:shadow-md hover:-translate-y-0.5`}
         onClick={onToggle}>
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[17px] flex-shrink-0"
             style={{backgroundColor: n.bg}}>{n.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-semibold text-gray-800 text-[13px]">{n.label}</span>
            <span className="font-bold text-[12px]" style={{color}}>{label}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
                 style={{width:`${Math.min(pct,100)}%`, backgroundColor:color}}/>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-gray-400 text-[10px]">{Math.round(n.val)} {n.unit}</span>
            <span className="text-gray-400 text-[10px]">{n.max} {n.unit}</span>
          </div>
        </div>
        <span className={`text-gray-400 transition-transform ${expanded?'rotate-90':''}`}>›</span>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-pink-50 bg-pink-50/30 anim-fade-up anim-d0">
          <p className="text-gray-600 text-[12px] leading-relaxed mb-2">{n.desc}</p>
          <div className="flex items-start gap-2 bg-[#fff7f0] rounded-xl px-3 py-2">
            <span className="text-[#F97316] text-[14px] mt-0.5">💡</span>
            <p className="text-[#b45309] text-[11px] leading-relaxed font-medium">{n.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Weekly Bar Chart ────────────────────────────── */
function WeeklyChart({ weeklyData }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm px-5 py-4">
      <p className="font-bold text-gray-800 text-[14px] mb-4">Tren Mingguan</p>
      <div className="flex gap-2 items-end" style={{height:80}}>
        {weeklyData.map((w, i) => {
          const { color } = getStatus(w.pct);
          const today = new Date();
          const currentDayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;
          const isToday = i === currentDayIdx;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold" style={{color: isToday? color:'#aaa'}}>{w.pct}%</span>
              <div className="w-full max-w-[32px] rounded-t-lg transition-all duration-500"
                   style={{
                     height: `${(w.pct/100)*56}px`,
                     backgroundColor: isToday ? color : color+'60',
                     outline: isToday ? `2px solid ${color}` : 'none'
                   }}/>
              <span className="text-[10px] text-gray-500">{w.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Child Card ──────────────────────────────────── */
function ChildCard({ child, overallPct }) {
  const getAgeString = (birthDateStr) => {
    if (!birthDateStr) return '-';
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }
    if (years === 0) return `${months} bulan`;
    return `${years} tahun`;
  };

  const getGenderLabel = (g) => {
    if (!g) return '-';
    return g.toLowerCase() === 'laki' ? 'Laki-laki' : 'Perempuan';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4">
      <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
        {child.jenisKelamin?.toLowerCase() === 'laki' ? '👦' : '👧'}
      </div>
      <div className="flex-1">
        <p className="font-bold text-gray-800 text-[16px]">{child.namaAnak || 'Nama Anak'}</p>
        <p className="text-gray-500 text-[12px]">{getAgeString(child.tanggalLahir)} · {child.beratBadan ? `${child.beratBadan} kg` : '-'} · {child.tinggiBadan ? `${child.tinggiBadan} cm` : '-'} · {getGenderLabel(child.jenisKelamin)}</p>
      </div>
      <div className="text-right">
        <p className="text-[#f2658f] font-bold text-[14px]">{overallPct}%</p>
        <p className="text-gray-400 text-[10px]">AKG Hari Ini</p>
      </div>
    </div>
  );
}

/* ── MAIN ────────────────────────────────────────── */
export default function DetailAKG({ onBack, onNavigate }) {
  const { user } = useAuth();
  const child = user?.childProfile || {};
  const [activeTab,    setActiveTab]    = useState(0);
  const [expandedIdx,  setExpandedIdx]  = useState(null);

  const [history, setHistory] = useState([]);
  const [todayTotals, setTodayTotals] = useState({ kkal: 0, protein: 0, fat: 0, carbohydrate: 0, kalsium: 0, zatBesi: 0, kalium: 0, vitC: 0 });
  const [loading, setLoading] = useState(true);

  const toggleExpand = (i) => setExpandedIdx(expandedIdx===i ? null : i);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const [todayRes, historyRes] = await Promise.all([
          api.getLogsByDate(toDateKey(new Date())),
          api.getHistory()
        ]);
        if (active) {
          setTodayTotals(todayRes.totals || { kkal: 0, protein: 0, fat: 0, carbohydrate: 0, kalsium: 0, zatBesi: 0, kalium: 0, vitC: 0 });
          setHistory(historyRes || []);
        }
      } catch (err) {
        console.error('Error fetching data for DetailAKG:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    loadData();
    return () => { active = false; };
  }, []);

  const DEFAULT_TARGETS = {
    kkal: 1400,
    protein: 25,
    kalsium: 1000,
    zatBesi: 10,
    kalium: 2700,
    karbohidrat: 220,
    lemakBaik: 50,
    vitC: 45
  };

  const targets = user?.akgTargets || DEFAULT_TARGETS;

  const currentTotals = useMemo(() => {
    if (activeTab === 0) {
      return todayTotals;
    } else if (activeTab === 1) {
      // Last 7 days
      const last7Days = history.slice(-7);
      if (last7Days.length === 0) return { kkal: 0, protein: 0, fat: 0, carbohydrate: 0, kalsium: 0, zatBesi: 0, kalium: 0, vitC: 0 };
      const sum = last7Days.reduce((acc, day) => ({
        kkal: acc.kkal + day.kkal,
        protein: acc.protein + day.protein,
        fat: acc.fat + day.fat,
        carbohydrate: acc.carbohydrate + day.carbohydrate,
        kalsium: acc.kalsium + day.kalsium,
        zatBesi: acc.zatBesi + day.zatBesi,
        kalium: acc.kalium + day.kalium,
        vitC: acc.vitC + day.vitC,
      }), { kkal: 0, protein: 0, fat: 0, carbohydrate: 0, kalsium: 0, zatBesi: 0, kalium: 0, vitC: 0 });
      
      const daysCount = 7;
      return {
        kkal: parseFloat((sum.kkal / daysCount).toFixed(1)),
        protein: parseFloat((sum.protein / daysCount).toFixed(1)),
        fat: parseFloat((sum.fat / daysCount).toFixed(1)),
        carbohydrate: parseFloat((sum.carbohydrate / daysCount).toFixed(1)),
        kalsium: parseFloat((sum.kalsium / daysCount).toFixed(1)),
        zatBesi: parseFloat((sum.zatBesi / daysCount).toFixed(1)),
        kalium: parseFloat((sum.kalium / daysCount).toFixed(1)),
        vitC: parseFloat((sum.vitC / daysCount).toFixed(1)),
      };
    } else {
      // Last 30 days
      const last30Days = history.slice(-30);
      if (last30Days.length === 0) return { kkal: 0, protein: 0, fat: 0, carbohydrate: 0, kalsium: 0, zatBesi: 0, kalium: 0, vitC: 0 };
      const sum = last30Days.reduce((acc, day) => ({
        kkal: acc.kkal + day.kkal,
        protein: acc.protein + day.protein,
        fat: acc.fat + day.fat,
        carbohydrate: acc.carbohydrate + day.carbohydrate,
        kalsium: acc.kalsium + day.kalsium,
        zatBesi: acc.zatBesi + day.zatBesi,
        kalium: acc.kalium + day.kalium,
        vitC: acc.vitC + day.vitC,
      }), { kkal: 0, protein: 0, fat: 0, carbohydrate: 0, kalsium: 0, zatBesi: 0, kalium: 0, vitC: 0 });
      
      const daysCount = 30;
      return {
        kkal: parseFloat((sum.kkal / daysCount).toFixed(1)),
        protein: parseFloat((sum.protein / daysCount).toFixed(1)),
        fat: parseFloat((sum.fat / daysCount).toFixed(1)),
        carbohydrate: parseFloat((sum.carbohydrate / daysCount).toFixed(1)),
        kalsium: parseFloat((sum.kalsium / daysCount).toFixed(1)),
        zatBesi: parseFloat((sum.zatBesi / daysCount).toFixed(1)),
        kalium: parseFloat((sum.kalium / daysCount).toFixed(1)),
        vitC: parseFloat((sum.vitC / daysCount).toFixed(1)),
      };
    }
  }, [activeTab, todayTotals, history]);

  const dynamicNutrients = useMemo(() => [
    { emoji:'⚡', bg:'#FFF7CC', label:'Energi',      val: currentTotals.kkal || 0, max: targets.kkal || 1400, unit:'kkal',
      desc:'Energi dibutuhkan untuk aktivitas harian dan pertumbuhan anak.',
      tip:'Tambahkan nasi atau roti gandum untuk mencukupi kebutuhan energi.' },
    { emoji:'🍗', bg:'#FFE4EC', label:'Protein',     val: currentTotals.protein || 0, max: targets.protein || 25, unit:'gram',
      desc:'Protein penting untuk pembentukan otot dan jaringan tubuh anak.',
      tip:'Konsumsi telur, ayam, atau ikan untuk meningkatkan asupan protein.' },
    { emoji:'💧', bg:'#E0F3FF', label:'Kalium',      val: currentTotals.kalium || 0, max: targets.kalium || 2700, unit:'mg',
      desc:'Kalium menjaga keseimbangan cairan dan fungsi jantung anak.',
      tip:'Buah dan sayuran segar adalah sumber kalium yang baik.' },
    { emoji:'🌿', bg:'#E7F8E7', label:'Zat Besi',    val: currentTotals.zatBesi || 0, max: targets.zatBesi || 10, unit:'mg',
      desc:'Zat besi mencegah anemia dan mendukung perkembangan otak anak.',
      tip:'Perbanyak sayur bayam, tempe, dan kacang-kacangan.' },
    { emoji:'🦷', bg:'#F0E8FF', label:'Kalsium',     val: currentTotals.kalsium || 0, max: targets.kalsium || 1000, unit:'mg',
      desc:'Kalsium untuk pembentukan tulang dan gigi yang kuat.',
      tip:'Susu, keju, dan yogurt adalah sumber kalsium terbaik.' },
    { emoji:'🍊', bg:'#FFF0E0', label:'Vitamin C',   val: currentTotals.vitC || 0, max: targets.vitC || 45, unit:'mg',
      desc:'Vitamin C meningkatkan imunitas dan penyerapan zat besi.',
      tip:'Jeruk, jambu biji, dan tomat kaya akan vitamin C.' },
    { emoji:'🌾', bg:'#FFF7E0', label:'Karbohidrat', val: currentTotals.carbohydrate || 0, max: targets.karbohidrat || 220, unit:'gram',
      desc:'Karbohidrat adalah sumber energi utama untuk otak dan tubuh.',
      tip:'Pilih karbohidrat kompleks seperti nasi merah atau oatmeal.' },
    { emoji:'🥑', bg:'#F0FFF0', label:'Lemak Baik',  val: currentTotals.fat || 0, max: targets.lemakBaik || 50, unit:'gram',
      desc:'Lemak baik mendukung perkembangan otak dan penyerapan vitamin.',
      tip:'Alpukat, ikan salmon, dan kacang-kacangan mengandung lemak baik.' },
  ], [currentTotals, targets]);

  const overallPct = useMemo(() => {
    const pKkal = Math.min((todayTotals.kkal || 0) / (targets.kkal || 1) * 100, 100);
    const pProtein = Math.min((todayTotals.protein || 0) / (targets.protein || 1) * 100, 100);
    const pKalium = Math.min((todayTotals.kalium || 0) / (targets.kalium || 1) * 100, 100);
    const pZatBesi = Math.min((todayTotals.zatBesi || 0) / (targets.zatBesi || 1) * 100, 100);
    return Math.round((pKkal + pProtein + pKalium + pZatBesi) / 4);
  }, [todayTotals, targets]);

  const weeklyData = useMemo(() => {
    const daysLabel = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const today = new Date();
    const currentDay = today.getDay();
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    monday.setHours(0,0,0,0);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = toDateKey(d);
      
      const dayHistory = history.find(h => h.date === dateStr);
      
      let pct = 0;
      if (dayHistory) {
        const pKkal = Math.min(dayHistory.kkal / targets.kkal * 100, 100);
        const pProtein = Math.min(dayHistory.protein / targets.protein * 100, 100);
        const pKalium = Math.min(dayHistory.kalium / targets.kalium * 100, 100);
        const pZatBesi = Math.min(dayHistory.zatBesi / targets.zatBesi * 100, 100);
        pct = Math.round((pKkal + pProtein + pKalium + pZatBesi) / 4);
      } else if (dateStr === toDateKey(new Date())) {
        pct = overallPct;
      }
      
      weekDays.push({
        day: daysLabel[i],
        pct
      });
    }
    return weekDays;
  }, [history, overallPct, targets]);

  return (
    <div className="font-['Poppins']">

      {/* ══════ MOBILE ══════ */}
      <div className="lg:hidden bg-pink-base min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-5 pt-6 pb-3 flex items-center gap-3 anim-fade-up anim-d0">
          <button onClick={onBack} className="text-gray-600 hover:text-[#f2658f] transition-colors"><BackIcon /></button>
          <h1 className="flex-1 text-center text-[#f2658f] font-bold text-[20px] mr-6">Detail AKG</h1>
        </div>

        <div className="px-5 pb-8 flex flex-col gap-4 overflow-y-auto">
          {/* Child Card */}
          <div className="anim-fade-up anim-d1"><ChildCard child={child} overallPct={overallPct} /></div>

          {/* Donut + overall pct */}
          <div className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-5 anim-scale-in anim-d2">
            <DonutChart pct={overallPct} size={110} sw={12}/>
            <div>
              <p className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold mb-1">Total AKG Hari Ini</p>
              <p className="text-gray-800 font-bold text-[26px] leading-none">{overallPct}%</p>
              <p className="text-gray-400 text-[12px] mt-1">dari kebutuhan harian</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-white/70 rounded-full p-1 w-fit anim-scale-in anim-d3">
            {TABS.map((t,i) => (
              <button key={i} onClick={()=>setActiveTab(i)}
                className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all
                  ${activeTab===i?'bg-[#f2658f] text-white shadow':'text-gray-500'}`}>{t}</button>
            ))}
          </div>

          {/* Nutrients */}
          <div className="flex flex-col gap-2.5">
            {dynamicNutrients.map((n,i) => (
              <div key={i} className="anim-fade-up" style={{animationDelay:`${i*50}ms`}}>
                <NutriCard n={n} expanded={expandedIdx===i} onToggle={()=>toggleExpand(i)}/>
              </div>
            ))}
          </div>

          {/* Weekly Tren */}
          <div className="anim-fade-up anim-d6"><WeeklyChart weeklyData={weeklyData} /></div>
        </div>
      </div>

      {/* ══════ DESKTOP ══════ */}
      <div className="hidden lg:flex flex-row h-screen overflow-hidden bg-pink-base">
        <span className="absolute top-10 left-8  text-[#f2658f]/40 text-3xl select-none anim-twinkle pointer-events-none">✦</span>
        <span className="absolute bottom-20 left-[35%] text-[#f2658f]/30 text-xl select-none anim-twinkle-b pointer-events-none">✦</span>
        <span className="absolute top-[40%] right-12 text-[#f2658f]/25 text-2xl select-none anim-twinkle-c pointer-events-none">✦</span>

        {/* ── KIRI ── */}
        <div className="w-[48%] h-full flex flex-col px-12 xl:px-16 py-8 overflow-y-auto no-scrollbar relative z-10">
          {/* Back */}
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-[#f2658f]
                                              transition-colors text-[14px] font-medium mb-6 w-fit">
            <BackIcon /> Kembali
          </button>
          
          <div className="flex items-center gap-3 mb-8 anim-fade-left anim-d0">
            <img src={logoImg} className="w-10 h-10 object-contain rounded-2xl shadow-md" alt="NutriSi Logo" />
            <span className="text-[#f2658f] font-bold text-[22px] tracking-tight">NutriSi</span>
          </div>
          <h1 className="text-[48px] xl:text-[58px] font-bold mb-4 leading-[52px] xl:leading-[62px]
                         tracking-[-1.5px] text-[#f2658f] italic anim-fade-left anim-d1"
              style={{textShadow: stickerShadow}}>
            <span className="block">Detail</span>
            <span className="block">AKG</span>
            <span className="block">{child.namaAnak || 'Anak'}</span>
          </h1>
          <p className="text-gray-600 text-[15px] font-medium max-w-[380px] mb-6 leading-relaxed anim-fade-left anim-d2">
            Angka Kecukupan Gizi (AKG) harian anak berdasarkan usia, berat badan, dan tinggi badan.
          </p>

          {/* Big Donut */}
          <div className="flex items-center gap-6 bg-white/80 rounded-3xl px-6 py-5 shadow-sm
                          border border-pink-100 mb-5 anim-scale-in anim-d3">
            <DonutChart pct={overallPct} size={140} sw={14}/>
            <div>
              <p className="text-gray-500 text-[12px] mb-1 uppercase tracking-wider font-semibold">Total AKG</p>
              <p className="text-gray-800 font-bold text-[28px] leading-none">{overallPct}%</p>
              <p className="text-gray-500 text-[13px] mt-1">dari kebutuhan harian</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['Energi','Protein','Kalium','Zat Besi'].map((l,i) => {
                  const n = dynamicNutrients[i], pct = Math.round((n.val/n.max)*100);
                  const {color} = getStatus(pct);
                  return (
                    <span key={i} className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{backgroundColor:color+'20',color}}>
                      {n.emoji} {pct}%
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Child Card */}
          <div className="anim-fade-up anim-d4"><ChildCard child={child} overallPct={overallPct} /></div>

          {/* Weekly Chart */}
          <div className="mt-4 anim-fade-up anim-d5"><WeeklyChart weeklyData={weeklyData} /></div>
        </div>

        {/* ── KANAN ── */}
        <div className="w-[52%] h-full flex flex-col px-10 xl:px-14 py-8 overflow-y-auto no-scrollbar relative z-10">
          <div className="mb-4 anim-fade-right anim-d0">
            <h2 className="text-gray-800 font-bold text-[22px]">Breakdown Nutrisi</h2>
            <p className="text-gray-500 text-[13px]">Klik setiap nutrisi untuk melihat tips pemenuhan.</p>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 bg-white/70 rounded-full p-1 mb-5 w-fit anim-scale-in anim-d0">
            {TABS.map((t, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all
                  ${activeTab===i ? 'bg-[#f2658f] text-white shadow' : 'text-gray-500 hover:text-[#f2658f]'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Nutrients List */}
          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto no-scrollbar">
            {dynamicNutrients.map((n, i) => (
              <div key={i} className="anim-fade-up" style={{animationDelay:`${i*60}ms`}}>
                <NutriCard n={n} expanded={expandedIdx===i} onToggle={()=>toggleExpand(i)}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
