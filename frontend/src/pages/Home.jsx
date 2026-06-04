import logoImg from '../assets/logo.png';
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, toDateKey } from '../services/api';
import nasiImg   from '../assets/nasi.png';
import pisangImg from '../assets/pisang.png';
import cakeImg   from '../assets/cake.png';
import ikanImg   from '../assets/ikan2.png';

/* ═══════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════ */
const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun',
                'Jul','Agu','Sep','Okt','Nov','Des'];

const getStatus = (pct) => {
  if (pct >= 100) return { label: 'Sangat Baik', color: '#22C55E' };
  if (pct >=  80) return { label: 'Baik',        color: '#3B82F6' };
  if (pct >=  50) return { label: 'Cukup',       color: '#F97316' };
  return             { label: 'Rendah',      color: '#EF4444' };
};

/* ═══════════════════════════════════════════════════
   ICONS (SVG inline)
   ═══════════════════════════════════════════════════ */
const HomeIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const ClockIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 7v5l3 3"/></svg>;
const MenuIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
const PersonIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;
const BellIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>;
const ChevLeft   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevRight  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const CalIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const PlusIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const WarnIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>;

/* ═══════════════════════════════════════════════════
   DONUT CHART
   ═══════════════════════════════════════════════════ */
function DonutChart({ percent, size = 118, strokeW = 12 }) {
  const { label, color } = getStatus(percent);
  const r   = size / 2 - strokeW - 2;
  const cx  = size / 2;
  const cir = 2 * Math.PI * r;
  const dash = Math.min(percent, 100) / 100 * cir;
  const fs  = Math.round(size * 0.165);
  const fss = Math.round(size * 0.1);
  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0"
         style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#ECECEC" strokeWidth={strokeW} />
        <circle cx={cx} cy={cx} r={r} fill="none"
          stroke={color} strokeWidth={strokeW}
          strokeDasharray={`${dash} ${cir - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="font-bold" style={{ color, fontSize: fs }}>{percent}%</span>
        <span className="font-semibold mt-1" style={{ color: '#888', fontSize: fss }}>{label}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   NUTRISI ROW
   ═══════════════════════════════════════════════════ */
function NutriRow({ emoji, bg, label, val, max, unit, size = 'sm' }) {
  const lg = size === 'lg';
  return (
    <div className={`flex items-center gap-2.5 ${lg ? 'py-2' : 'py-[5px]'}`}>
      <div className={`${lg ? 'w-9 h-9 rounded-xl text-[17px]' : 'w-[26px] h-[26px] rounded-lg text-[13px]'} 
                       flex items-center justify-center flex-shrink-0`}
           style={{ backgroundColor: bg }}>
        {emoji}
      </div>
      <div>
        <p className={`font-semibold text-gray-800 leading-none ${lg ? 'text-[13px]' : 'text-[11px]'}`}>{label}</p>
        <p className={`text-gray-400 leading-tight ${lg ? 'text-[12px]' : 'text-[10px]'}`}>{val} / {max} {unit}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ALERT BANNERS
   ═══════════════════════════════════════════════════ */
function Alerts({ alertsList }) {
  if (!alertsList || alertsList.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      {alertsList.map((alert, index) => {
        if (alert.type === 'danger') {
          return (
            <div key={index} className="flex items-center gap-2.5 bg-[#F2758A] rounded-2xl px-4 py-3">
              <span className="text-white flex-shrink-0"><WarnIcon /></span>
              <p className="text-white font-semibold text-[13px] leading-tight">
                {alert.message}
              </p>
            </div>
          );
        } else {
          return (
            <div key={index} className="flex items-center gap-2.5 bg-[#FFD166] rounded-2xl px-4 py-3">
              <span className="text-[#7A5000] flex-shrink-0 text-[16px]">🔔</span>
              <p className="text-[#7A5000] font-semibold text-[13px]">
                {alert.message}
              </p>
            </div>
          );
        }
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DATE NAVIGATOR (shared)
   ═══════════════════════════════════════════════════ */
function DateNav({ date, onPrev, onNext }) {
  const label = `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={onPrev}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-[#f2658f] transition-colors">
        <ChevLeft />
      </button>
      <div className="flex items-center gap-1.5 bg-white/70 rounded-full px-2.5 py-1 border border-pink-100">
        <span className="text-gray-500"><CalIcon /></span>
        <span className="text-gray-600 font-medium text-[12px]">{label}</span>
      </div>
      <button onClick={onNext}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-[#f2658f] transition-colors">
        <ChevRight />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BOTTOM NAV PILL
   ═══════════════════════════════════════════════════ */
function BottomNav({ active = 0, onSelect }) {
  const items = [HomeIcon, ClockIcon, MenuIcon, PersonIcon];
  return (
    <div className="flex justify-center">
      <div className="bg-[#f2658f] rounded-full px-2.5 py-2 flex items-center gap-1.5 shadow-xl">
        {items.map((Icon, i) => (
          <button key={i} onClick={() => onSelect?.(i)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
              ${i === active ? 'bg-white text-[#f2658f] shadow' : 'text-white/90 hover:text-white'}`}>
            <Icon />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MEAL CARD — MOBILE (persis desain)
   ═══════════════════════════════════════════════════ */
function MealCardMobile({ label, sub, kkal, img, bgColor }) {
  return (
    <div className="relative rounded-[18px] flex-shrink-0 w-[120px]"
         style={{ backgroundColor: bgColor }}>
      {/* Food image floating top-right */}
      <div className="absolute -top-4 right-1 z-10">
        <img src={img} alt={label}
             className="w-[65px] h-[65px] object-contain drop-shadow-md" />
      </div>
      <div className="px-3 pt-11 pb-3">
        <p className="text-white font-bold text-[12px] leading-tight">{label}</p>
        <p className="text-white/80 text-[10px] leading-snug mt-0.5 whitespace-pre-line line-clamp-3 h-[42px] overflow-hidden">{sub}</p>
        <p className="text-white font-bold text-[13px] mt-2">{kkal} kkal</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MEAL CARD — DESKTOP (lebih besar)
   ═══════════════════════════════════════════════════ */
function MealCardDesktop({ label, sub, kkal, img, bgColor }) {
  return (
    <div className="relative rounded-2xl flex-1"
         style={{ backgroundColor: bgColor }}>
      <div className="absolute -top-5 right-2 z-10">
        <img src={img} alt={label}
             className="w-[85px] h-[85px] object-contain drop-shadow-lg" />
      </div>
      <div className="px-5 pt-14 pb-5">
        <p className="text-white font-bold text-[15px] leading-tight">{label}</p>
        <p className="text-white/80 text-[12px] leading-snug mt-1 line-clamp-2 h-[36px] overflow-hidden">{sub.replace('\n',' ')}</p>
        <p className="text-white font-bold text-[16px] mt-3">{kkal} kkal</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function Home({ onLogMakanan, onDetailAKG, onRekomendasi, onNavigate }) {
  const { user } = useAuth();
  const childName = user?.childProfile?.namaAnak || 'Anak';
  const [activeNav, setActiveNav] = useState(0);
  const [date, setDate] = useState(new Date());

  const [logs, setLogs] = useState([]);
  const [totals, setTotals] = useState({ kkal: 0, protein: 0, fat: 0, carbohydrate: 0, kalsium: 0, zatBesi: 0, kalium: 0, vitC: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const prevDay = () => { const d = new Date(date); d.setDate(d.getDate()-1); setDate(d); };
  const nextDay = () => { const d = new Date(date); d.setDate(d.getDate()+1); setDate(d); };

  useEffect(() => {
    let active = true;
    const fetchLogsAndHistory = async () => {
      try {
        setLoading(true);
        const dateKey = toDateKey(date);
        const [logsRes, historyRes] = await Promise.all([
          api.getLogsByDate(dateKey),
          api.getHistory()
        ]);
        if (active) {
          setLogs(logsRes.logs || []);
          setTotals(logsRes.totals || { kkal: 0, protein: 0, fat: 0, carbohydrate: 0, kalsium: 0, zatBesi: 0, kalium: 0, vitC: 0 });
          setHistory(historyRes || []);
        }
      } catch (err) {
        console.error('Error fetching logs/history for home:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchLogsAndHistory();
    return () => { active = false; };
  }, [date]);

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

  const dynamicNutrients = useMemo(() => [
    { emoji: '⚡', bg: '#FFF7CC', label: 'Energi',   val: Math.round(totals.kkal || 0).toLocaleString('id-ID'),   max: Math.round(targets.kkal || 1400).toLocaleString('id-ID'),    unit: 'kkal' },
    { emoji: '🍗', bg: '#FFE4EC', label: 'Protein',  val: Math.round(totals.protein || 0).toLocaleString('id-ID'),  max: Math.round(targets.protein || 25).toLocaleString('id-ID'),    unit: 'gram' },
    { emoji: '💧', bg: '#E0F3FF', label: 'Kalium',   val: Math.round(totals.kalium || 0).toLocaleString('id-ID'),   max: Math.round(targets.kalium || 2700).toLocaleString('id-ID'),   unit: 'mg'   },
    { emoji: '🌿', bg: '#E7F8E7', label: 'Zat Besi', val: Math.round(totals.zatBesi || 0).toLocaleString('id-ID'),  max: Math.round(targets.zatBesi || 10).toLocaleString('id-ID'),    unit: 'mg'   },
  ], [totals, targets]);

  const MEAL_TYPES = useMemo(() => [
    { label: 'Sarapan',     img: cakeImg,   bgColor: '#F89EBD' },
    { label: 'Cemilan',     img: pisangImg, bgColor: '#8DD68F' },
    { label: 'Makan Siang', img: nasiImg,   bgColor: '#B5A2EC' },
    { label: 'Makan Malam', img: ikanImg,   bgColor: '#BDB2FF' },
  ], []);

  const dynamicMeals = useMemo(() => {
    return MEAL_TYPES.map(type => {
      const logsForMeal = logs.filter(l => l.mealType === type.label);
      const totalKkal = logsForMeal.reduce((sum, l) => sum + (l.nutrition?.kkal || 0), 0);
      const foodNames = logsForMeal.map(l => l.food?.name).join(', ');
      return {
        label: type.label,
        sub: foodNames || 'Belum dicatat',
        kkal: Math.round(totalKkal),
        img: type.img,
        bgColor: type.bgColor
      };
    });
  }, [logs, MEAL_TYPES]);

  const overallPct = useMemo(() => {
    const pKkal = Math.min((totals.kkal || 0) / (targets.kkal || 1) * 100, 100);
    const pProtein = Math.min((totals.protein || 0) / (targets.protein || 1) * 100, 100);
    const pKalium = Math.min((totals.kalium || 0) / (targets.kalium || 1) * 100, 100);
    const pZatBesi = Math.min((totals.zatBesi || 0) / (targets.zatBesi || 1) * 100, 100);
    return Math.round((pKkal + pProtein + pKalium + pZatBesi) / 4);
  }, [totals, targets]);

  const dynamicAlerts = useMemo(() => {
    const alerts = [];
    const proteinShort = (totals.protein || 0) < ((targets.protein || 25) * 0.8);
    const zatBesiShort = (totals.zatBesi || 0) < ((targets.zatBesi || 10) * 0.8);

    if (proteinShort && zatBesiShort) {
      alerts.push({ type: 'danger', message: `Protein dan Zat Besi ${targets.namaAnak || childName} kurang!` });
    } else if (proteinShort) {
      alerts.push({ type: 'danger', message: `Protein ${targets.namaAnak || childName} kurang!` });
    } else if (zatBesiShort) {
      alerts.push({ type: 'danger', message: `Zat Besi ${targets.namaAnak || childName} kurang!` });
    }

    const mealTypes = ['Sarapan', 'Makan Siang', 'Makan Malam'];
    for (const m of mealTypes) {
      const hasMeal = logs.some(l => l.mealType === m);
      if (!hasMeal) {
        alerts.push({ type: 'warning', message: `${m} Belum dicatat.` });
        break;
      }
    }

    return alerts;
  }, [logs, totals, targets, childName]);

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
        const pKkal = Math.min(totals.kkal / targets.kkal * 100, 100);
        const pProtein = Math.min(totals.protein / targets.protein * 100, 100);
        const pKalium = Math.min(totals.kalium / targets.kalium * 100, 100);
        const pZatBesi = Math.min(totals.zatBesi / targets.zatBesi * 100, 100);
        pct = Math.round((pKkal + pProtein + pKalium + pZatBesi) / 4);
      }
      
      weekDays.push({
        day: daysLabel[i],
        pct
      });
    }
    return weekDays;
  }, [history, totals, targets]);

  const sisaKalori = Math.max(0, Math.round((targets.kkal || 1400) - (totals.kkal || 0)));
  const uniqueLoggedMeals = new Set(logs.map(l => l.mealType)).size;

  return (
    <div className="font-['Poppins']">
      
      {/* ─── MOBILE VIEW ─── */}
      <div className="lg:hidden flex flex-col bg-pink-base min-h-screen relative">
        <div className="flex-1 overflow-y-auto pb-32 anim-fade-up anim-d0">
          
          {/* Header */}
          <div className="px-5 pt-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-[#f2658f] font-bold text-[18px] tracking-tight">{childName}'s Diary</h1>
              <span className="text-[#f2658f]"><BellIcon /></span>
            </div>
            <DateNav date={date} onPrev={prevDay} onNext={nextDay} />
          </div>

          <div className="px-5 flex flex-col gap-4">
            {/* Alert banners */}
            <Alerts alertsList={dynamicAlerts} />

            {/* AKG Harian Anak */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-800 font-bold text-[15px]">AKG Harian Anak</p>
                <button onClick={onDetailAKG} className="text-[#3B82F6] text-[12px] font-semibold flex items-center gap-0.5 hover:underline">
                  Detail <span className="ml-0.5">→</span>
                </button>
              </div>

              {/* White card */}
              <div className="bg-white rounded-2xl px-4 py-4 shadow-sm flex items-center gap-3">
                <div className="flex-1 flex flex-col">
                  {dynamicNutrients.map((n, i) => (
                    <NutriRow key={i} {...n} />
                  ))}
                </div>
                <DonutChart percent={overallPct} size={118} strokeW={12} />
              </div>
            </div>

            {/* Log Makan Hari Ini */}
            <div>
              <p className="text-gray-800 font-bold text-[15px] mb-3">Log Makan Hari Ini</p>
              <div className="flex gap-3 overflow-x-auto pb-2 pt-5 -mx-1 px-1 no-scrollbar">
                {dynamicMeals.map((m, i) => (
                  <MealCardMobile key={i} {...m} />
                ))}
                {/* + button */}
                <div className="flex-shrink-0 flex items-center pl-1">
                  <button onClick={onLogMakanan}
                          className="w-10 h-10 rounded-full bg-[#f2658f] flex items-center justify-center
                                     text-white shadow-md hover:bg-[#d94876] transition-all hover:scale-110 active:scale-95">
                    <PlusIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 pb-5 pt-2 bg-gradient-to-t from-pink-100/80 to-transparent">
          <BottomNav active={activeNav} onSelect={(i) => { setActiveNav(i); if (i===2) onRekomendasi?.(); else onNavigate?.(i); }} />
        </div>
      </div>

      {/* ─── DESKTOP VIEW ─── */}
      <div className="hidden lg:flex flex-row h-screen overflow-hidden bg-pink-base">
        
        {/* Decorative sparkles */}
        <span className="absolute top-12 left-10   text-[#f2658f]/40 text-3xl select-none anim-twinkle pointer-events-none">✦</span>
        <span className="absolute top-32 right-12  text-[#f2658f]/30 text-2xl select-none anim-twinkle-b pointer-events-none">✦</span>
        <span className="absolute bottom-24 left-[30%] text-[#f2658f]/35 text-xl select-none anim-twinkle-c pointer-events-none">✦</span>
        <span className="absolute top-[45%] right-[48%] text-[#f2658f]/30 text-2xl select-none anim-twinkle-d pointer-events-none">✦</span>
        <span className="absolute bottom-16 right-16 text-[#f2658f]/35 text-lg select-none anim-twinkle pointer-events-none">✦</span>

        {/* LEFT PANEL */}
        <div className="w-[52%] xl:w-[50%] h-full flex flex-col px-12 xl:px-16 py-8 relative z-10">
          
          <div className="flex items-center gap-3 mb-7 anim-fade-left anim-d0">
            <img src={logoImg} className="w-10 h-10 object-contain rounded-2xl shadow-md" alt="NutriSi Logo" />
            <span className="text-[#f2658f] font-bold text-[22px] tracking-tight">NutriSi</span>
          </div>

          <div className="flex items-center justify-between mb-5 anim-fade-left anim-d1">
            <div className="flex items-center gap-2">
              <h1 className="text-[#f2658f] font-bold text-[28px] tracking-tight">{childName}'s Diary</h1>
              <span className="text-[#f2658f]"><BellIcon /></span>
            </div>
            <DateNav date={date} onPrev={prevDay} onNext={nextDay} />
          </div>

          {/* Alerts */}
          <div className="mb-5 anim-fade-up anim-d2">
            <Alerts alertsList={dynamicAlerts} />
          </div>

          {/* AKG Harian */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 anim-fade-left anim-d3">
              <p className="text-gray-800 font-bold text-[17px]">AKG Harian Anak</p>
              <button onClick={onDetailAKG} className="text-[#3B82F6] text-[13px] font-semibold flex items-center gap-0.5 hover:underline">
                Detail →
              </button>
            </div>

            <div className="bg-white rounded-3xl px-6 py-5 shadow-md flex items-center gap-6 flex-1 anim-scale-in anim-d4">
              <div className="flex flex-col justify-center gap-0.5 flex-1">
                {dynamicNutrients.map((n, i) => (
                  <NutriRow key={i} {...n} size="lg" />
                ))}
              </div>
              <DonutChart percent={overallPct} size={160} strokeW={16} />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="flex gap-3 mt-5 anim-fade-up anim-d6">
            {[
              { val: Math.round(totals.kkal || 0) + ' kkal', label: 'Total Hari Ini' },
              { val: `${uniqueLoggedMeals} Waktu`, label: 'Makan Tercatat' },
              { val: `${sisaKalori} kkal`, label: 'Sisa Kalori' },
            ].map((s, i) => (
              <div key={i} className="flex-1 bg-white/80 border border-pink-100 rounded-2xl px-4 py-3 text-center shadow-sm">
                <p className="text-[#f2658f] font-bold text-[16px] leading-tight">{s.val}</p>
                <p className="text-gray-500 text-[11px] font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[48%] xl:w-[50%] h-full flex flex-col px-10 xl:px-14 py-8 relative z-10">
          
          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-6 pb-4">
            <div className="flex items-center justify-between anim-fade-right anim-d1">
              <p className="text-gray-800 font-bold text-[20px]">Log Makan Hari Ini</p>
              <button onClick={onLogMakanan}
                      className="flex items-center gap-2 bg-[#f2658f] hover:bg-[#d94876] text-white
                                 text-[13px] font-semibold px-4 py-2 rounded-full shadow transition-all
                                 hover:scale-105 active:scale-95">
                <PlusIcon />
                Tambah
              </button>
            </div>

            {/* Meals list */}
            <div className="flex gap-4 pt-2 anim-fade-up anim-d3">
              {dynamicMeals.map((m, i) => (
                <MealCardDesktop key={i} {...m} />
              ))}
            </div>

            {/* Progress Bars */}
            <div className="bg-white rounded-3xl px-6 py-5 shadow-md anim-fade-up anim-d4">
              <p className="text-gray-800 font-bold text-[15px] mb-4">Progres Nutrisi Harian</p>
              <div className="flex flex-col gap-3">
                {dynamicNutrients.map((n, i) => {
                  // Parse val and max strings to float by removing dot separators
                  const valClean = parseFloat(n.val.toString().replace(/\./g, '').replace(',', '.')) || 0;
                  const maxClean = parseFloat(n.max.toString().replace(/\./g, '').replace(',', '.')) || 1;
                  const pct = Math.round((valClean / maxClean) * 100);
                  const { color, bg } = getStatus(pct);
                  return (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[12px] font-medium text-gray-700">
                        <span className="flex items-center gap-1.5">
                          <span className="text-[13px]">{n.emoji}</span>
                          <span>{n.label}</span>
                        </span>
                        <span className="text-gray-500 font-semibold">{n.val} / {n.max} {n.unit}</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden" style={{ backgroundColor: bg }}>
                        <div className="h-full rounded-full transition-all duration-500"
                             style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Averages */}
            <div className="bg-white rounded-3xl px-6 py-5 shadow-md anim-fade-up anim-d5">
              <p className="text-gray-800 font-bold text-[15px] mb-4">Rata-rata Minggu Ini</p>
              <div className="flex gap-2">
                {weeklyData.map((w, i) => {
                  const { color } = getStatus(w.pct);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full flex items-end justify-center" style={{ height: 48 }}>
                        <div className="w-full max-w-[18px] rounded-full transition-all duration-500"
                             style={{ height: `${w.pct}%`, backgroundColor: i === 4 ? color : color + '90' }} />
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium">{w.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="pt-4 pb-5 anim-fade-up anim-d6">
            <BottomNav active={activeNav} onSelect={(i) => { setActiveNav(i); if (i===2) onRekomendasi?.(); else onNavigate?.(i); }} />
          </div>
        </div>

      </div>
    </div>
  );
}
