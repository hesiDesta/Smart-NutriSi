import logoImg from '../assets/logo.png';
import React, { useState, useEffect, useCallback } from 'react';
import { api, toDateKey } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

const toKey = (d) => {
  const yy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${yy}-${mm}-${dd}`;
};

const sumMeal = (items) => items.reduce(
  (acc, f) => ({
    kkal:    +(acc.kkal    + f.kkal    * f.gram / 100).toFixed(1),
    protein: +(acc.protein + f.protein * f.gram / 100).toFixed(1),
    kalsium: +(acc.kalsium + f.kalsium * f.gram / 100).toFixed(1),
  }),
  { kkal:0, protein:0, kalsium:0 }
);

/* ═══════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════ */
const HomeIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const ClockIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 7v5l3 3"/></svg>;
const MenuIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
const PersonIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;
const ChevLeft   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevRight  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const HeartIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const CalIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const EmptyIcon  = () => <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#f2658f" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="15" x2="16" y2="15"/></svg>;

/* ── Bottom Nav ── */
function BottomNav({ active = 1, onSelect }) {
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

/* ── Date Navigator ── */
function DateNav({ date, onPrev, onNext }) {
  const label = `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  return (
    <div className="flex items-center gap-2">
      <button onClick={onPrev}
        className="w-7 h-7 flex items-center justify-center rounded-full
                   text-gray-400 hover:text-[#f2658f] hover:bg-pink-50 transition-all">
        <ChevLeft />
      </button>
      <div className="flex items-center gap-1.5 bg-white/80 rounded-full px-3 py-1.5
                      border border-pink-100 shadow-sm">
        <span className="text-gray-400"><CalIcon /></span>
        <span className="text-gray-600 font-semibold text-[12px]">{label}</span>
      </div>
      <button onClick={onNext}
        className="w-7 h-7 flex items-center justify-center rounded-full
                   text-gray-400 hover:text-[#f2658f] hover:bg-pink-50 transition-all">
        <ChevRight />
      </button>
    </div>
  );
}

/* ── Meal Group Card ── */
function MealGroup({ waktu, jam, items }) {
  const total = sumMeal(items);
  const waktuColors = {
    Pagi:  { dot:'#F97316', bg:'#FFF7ED' },
    Siang: { dot:'#3B82F6', bg:'#EFF6FF' },
    Malam: { dot:'#8B5CF6', bg:'#F5F3FF' },
    Cemilan:{ dot:'#22C55E', bg:'#F0FDF4' },
  };
  const clr = waktuColors[waktu] || { dot:'#f2658f', bg:'#fce4ec' };

  return (
    <div className="anim-fade-up">
      {/* Waktu label */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
             style={{ backgroundColor: clr.dot }} />
        <span className="text-gray-700 font-bold text-[14px]">{waktu}</span>
        <span className="text-gray-400 font-medium text-[12px]">({jam})</span>
      </div>

      {/* White card */}
      <div className="bg-white rounded-[16px] overflow-hidden shadow-sm border border-gray-50">
        {items.map((food, i) => {
          const k = +(food.kkal    * food.gram / 100).toFixed(0);
          const p = +(food.protein * food.gram / 100).toFixed(1);
          const ca= +(food.kalsium * food.gram / 100).toFixed(0);
          return (
            <div key={i}
                 className={`px-4 py-3 flex items-center justify-between
                             ${i < items.length-1 ? 'border-b border-gray-50' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 font-semibold text-[13px] leading-tight">{food.name}</p>
                <p className="text-[#f2658f] text-[11px] font-medium mt-0.5">
                  {k} kkal · {p}g protein · {ca}mg kalsium / {food.gram}g
                </p>
              </div>
              <div className="ml-3 flex-shrink-0">
                <span className="text-[11px] font-bold text-gray-400">{food.gram}g</span>
              </div>
            </div>
          );
        })}

        {/* Total bar */}
        <div className="px-4 py-2.5 flex justify-end"
             style={{ backgroundColor: clr.bg }}>
          <p className="text-gray-500 text-[11px] font-semibold">
            Total:&nbsp;
            <span className="text-gray-700">{total.kkal} kkal</span>
            &nbsp;·&nbsp;
            <span className="text-gray-700">{total.protein}g protein</span>
            &nbsp;·&nbsp;
            <span className="text-gray-700">{total.kalsium}mg kalsium</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Grand Total Card ── */
function GrandTotal({ meals, akgTarget = 1350 }) {
  const all = meals.flatMap((m) => m.items);
  const total = sumMeal(all);
  const TARGET = { kkal: akgTarget };
  const pct = Math.min(Math.round(total.kkal / TARGET.kkal * 100), 100);
  const color = pct >= 90 ? '#22C55E' : pct >= 60 ? '#F97316' : '#EF4444';

  return (
    <div className="bg-white rounded-[18px] px-5 py-4 shadow-sm border border-gray-50">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-800 font-bold text-[14px]">Total Harian</p>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: color + '20', color }}>
          {pct}% AKG
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label:'Energi',  val: total.kkal,    unit:'kkal', color:'#f2658f', bg:'#fce4ec' },
          { label:'Protein', val: total.protein, unit:'gram', color:'#8B5CF6', bg:'#F5F3FF' },
          { label:'Kalsium', val: total.kalsium, unit:'mg',   color:'#3B82F6', bg:'#EFF6FF' },
        ].map((item) => (
          <div key={item.label} className="rounded-[12px] px-3 py-2.5 text-center"
               style={{ backgroundColor: item.bg }}>
            <p className="text-[10px] font-medium mb-0.5" style={{ color: item.color }}>{item.label}</p>
            <p className="font-bold text-[15px] text-gray-800 leading-none">{item.val}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{item.unit}</p>
          </div>
        ))}
      </div>
      {/* Progress bar energi */}
      <div className="mt-3">
        <div className="flex justify-between mb-1">
          <span className="text-[10px] text-gray-500 font-medium">Energi dari target {akgTarget.toLocaleString('id-ID')} kkal</span>
          <span className="text-[10px] font-bold" style={{ color }}>{pct}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
               style={{ width:`${pct}%`, backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function Riwayat({ onBack, onNavigate }) {
  const { user } = useAuth();
  const akgTarget = user?.akgTargets?.kkal || 1350;
  const [date,      setDate]      = useState(new Date());
  const [activeNav, setActiveNav] = useState(1);
  const [meals,     setMeals]     = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [weeklyData,setWeeklyData]= useState([]);
  const [last3Days, setLast3Days] = useState([]);

  // Fetch full history dari API (semua hari yg pernah log)
  // dipakai untuk: grafik mingguan + 3 hari terakhir
  useEffect(() => {
    let cancelled = false;
    api.getHistory().then((history) => {
      if (cancelled || !Array.isArray(history)) return;

      // akgTarget diambil dari user context (sudah didefinisikan di atas)

      // Index history by date string YYYY-MM-DD
      const map = {};
      history.forEach((h) => { map[h.date] = h; });

      // === Grafik Minggu Ini (Sen-Min minggu sekarang) ===
      const today = new Date();
      const dow = today.getDay();             // 0=Min ... 6=Sab
      const offsetFromMonday = dow === 0 ? 6 : dow - 1; // Indo: Senin awal
      const monday = new Date(today);
      monday.setDate(today.getDate() - offsetFromMonday);

      const dayLabels = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
      const weekly = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        const entry = map[key];
        const pct = entry ? Math.min(Math.round((entry.kkal / akgTarget) * 100), 100) : 0;
        weekly.push({
          day: dayLabels[i],
          pct,
          isToday: d.toDateString() === today.toDateString(),
          dateKey: key,
        });
      }
      setWeeklyData(weekly);

      // === 3 Hari Terakhir (yg ada log saja, urutkan dari terbaru) ===
      const sorted = [...history]
        .filter(h => h.kkal > 0)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3)
        .map(h => {
          const dt = new Date(h.date + 'T00:00:00');
          const pct = (h.kkal / akgTarget) * 100;
          let status = 'Kurang';
          if (pct >= 90) status = 'Sangat Baik';
          else if (pct >= 70) status = 'Baik';
          else if (pct >= 50) status = 'Cukup';
          return {
            date: `${dt.getDate()} ${MONTHS[dt.getMonth()]}`,
            kkal: Math.round(h.kkal),
            protein: +h.protein.toFixed(1),
            status,
          };
        });
      setLast3Days(sorted);
    }).catch(() => { /* silent */ });

    return () => { cancelled = true; };
  }, [meals]); // re-fetch saat meal hari ini berubah (log baru)

  const loadLogs = useCallback(async (d) => {
    setLoading(true);
    try {
      const key = toDateKey(d);
      const res = await api.getLogsByDate(key);
      // Group logs by mealType
      const grouped = {};
      (res.logs || []).forEach(log => {
        const mt = log.mealType || 'Pagi';
        if (!grouped[mt]) grouped[mt] = { waktu: mt, jam: new Date(log.createdAt || Date.now()).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}), items: [] };
        grouped[mt].items.push({ name: log.food.name, kkal: log.food.kkal, protein: log.food.protein, kalsium: log.food.kalsium, gram: log.gram, logId: log.id });
      });
      setMeals(Object.values(grouped));
    } catch {
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadLogs(date); }, [date, loadLogs]);

  const prevDay = () => { const d=new Date(date); d.setDate(d.getDate()-1); setDate(d); };
  const nextDay = () => { const d=new Date(date); d.setDate(d.getDate()+1); setDate(d); };

  // meals loaded from API via useEffect above



  return (
    <div className="font-['Poppins']">
      {/* ── MOBILE ── */}
      <div className="lg:hidden flex flex-col bg-pink-base min-h-screen">
        <div className="flex-1 overflow-y-auto pb-32">

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-6 pb-3">
            <button onClick={onBack}
              className="flex items-center gap-1 text-gray-500 text-[13px] font-medium hover:text-[#f2658f] transition-colors">
              <ChevLeft /> Kembali
            </button>
            <h1 className="text-[#f2658f] font-bold text-[20px] tracking-tight">Riwayat</h1>
            <button className="text-gray-400 hover:text-[#f2658f] transition-colors"><HeartIcon /></button>
          </div>

          {/* Date Nav */}
          <div className="px-5 mb-4">
            <DateNav date={date} onPrev={prevDay} onNext={nextDay} />
          </div>

          {/* Content */}
          <div className="px-5 flex flex-col gap-4">
            {meals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <EmptyIcon />
                <p className="text-gray-500 font-semibold text-[15px] mt-4">Tidak ada catatan</p>
                <p className="text-gray-400 text-[12px] mt-1">Belum ada makanan dicatat pada tanggal ini</p>
              </div>
            ) : (
              <>
                {meals.map((m, i) => (
                  <MealGroup key={i} waktu={m.waktu} jam={m.jam} items={m.items} />
                ))}
                <GrandTotal meals={meals} akgTarget={akgTarget} />
              </>
            )}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 pb-5 pt-2 bg-gradient-to-t from-pink-100/80 to-transparent">
          <BottomNav active={activeNav}
            onSelect={(i) => { setActiveNav(i); onNavigate?.(i); }} />
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden lg:flex flex-col h-screen bg-pink-base overflow-hidden border-l border-gray-100">

        {/* Stars */}
        <span className="absolute top-14 left-10 text-[#f2658f]/30 text-3xl select-none anim-twinkle pointer-events-none">✦</span>
        <span className="absolute top-36 right-14 text-[#f2658f]/25 text-2xl select-none anim-twinkle-b pointer-events-none">✦</span>
        <span className="absolute bottom-24 left-[34%] text-[#f2658f]/30 text-xl select-none anim-twinkle-c pointer-events-none">✦</span>
        <span className="absolute bottom-20 right-20 text-[#f2658f]/25 text-lg select-none anim-twinkle-d pointer-events-none">✦</span>

        {/* Top bar */}
        <div className="flex-shrink-0 px-10 xl:px-14 pt-7 pb-4 flex items-center justify-between">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-gray-500 text-[13px] font-medium hover:text-[#f2658f] transition-colors">
            <ChevLeft /> Kembali
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={logoImg} className="w-8 h-8 object-contain rounded-xl shadow-sm" alt="NutriSi Logo" />
              <span className="text-[#f2658f] font-bold text-[18px]">NutriSi</span>
            </div>
            <h1 className="text-[#f2658f] font-bold text-[22px] tracking-tight">— Riwayat Makan</h1>
          </div>
          <button className="text-gray-400 hover:text-[#f2658f] transition-colors"><HeartIcon /></button>
        </div>

        {/* Body: two columns */}
        <div className="flex flex-1 min-h-0 px-10 xl:px-14 pb-0 gap-6">

          {/* KIRI: Date + Meal Groups */}
          <div className="w-[55%] h-full flex flex-col pb-6 anim-fade-left anim-d1">
            {/* Date Nav */}
            <div className="mb-5">
              <DateNav date={date} onPrev={prevDay} onNext={nextDay} />
            </div>

            {/* Meals scroll */}
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
              {meals.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <EmptyIcon />
                  <p className="text-gray-500 font-semibold text-[16px] mt-4">Tidak ada catatan</p>
                  <p className="text-gray-400 text-[13px] mt-1">Belum ada makanan dicatat pada tanggal ini</p>
                </div>
              ) : (
                meals.map((m, i) => (
                  <MealGroup key={i} waktu={m.waktu} jam={m.jam} items={m.items} />
                ))
              )}
            </div>
          </div>

          {/* KANAN: Total + Grafik Mingguan */}
          <div className="flex-1 h-full flex flex-col px-4 pb-6 anim-fade-right anim-d2">
            
            {/* Scrollable Upper Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1 pb-2">
              {/* Grand Total */}
              {meals.length > 0 && <GrandTotal meals={meals} akgTarget={akgTarget} />}

              {/* Grafik mingguan */}
              <div className="bg-white rounded-[18px] px-5 py-4 shadow-sm border border-gray-50">
                <p className="text-gray-800 font-bold text-[14px] mb-3">Rata-rata Minggu Ini</p>
                {weeklyData.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-[12px]">
                    Belum ada catatan minggu ini
                  </div>
                ) : (
                  <div className="flex gap-2 items-end" style={{ height: 80 }}>
                    {weeklyData.map(({ day, pct, isToday }, i) => {
                      const color = pct >= 90 ? '#22C55E' : pct >= 60 ? '#f2658f' : pct > 0 ? '#EF4444' : '#E5E7EB';
                      const visualPct = pct > 0 ? Math.max(pct, 8) : 6;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                          <div className="w-full flex items-end justify-center" style={{ height: 64 }}>
                            <div className="w-full max-w-[28px] rounded-full transition-all duration-500"
                              style={{ height: `${visualPct}%`, backgroundColor: isToday ? color : color + 'B0' }} />
                          </div>
                          <span className={`text-[10px] font-semibold ${isToday ? 'text-[#f2658f]' : 'text-gray-400'}`}>{day}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Nutrisi 3 hari terakhir mini table */}
              <div className="bg-white rounded-[18px] px-5 py-4 shadow-sm border border-gray-50">
                <p className="text-gray-800 font-bold text-[14px] mb-3">3 Hari Terakhir</p>
                {last3Days.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-[12px]">
                    Catat makanan untuk melihat ringkasan 3 hari terakhir
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {last3Days.map((row, i) => {
                      const sColor = row.status === 'Sangat Baik' ? '#22C55E'
                                   : row.status === 'Baik'         ? '#3B82F6'
                                   : row.status === 'Cukup'        ? '#F97316'
                                                                   : '#EF4444';
                      return (
                        <div key={i} className="flex items-center justify-between py-2
                                                border-b border-gray-50 last:border-0">
                          <span className="text-gray-600 font-semibold text-[13px]">{row.date}</span>
                          <span className="text-gray-500 text-[12px]">{row.kkal} kkal</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: sColor + '20', color: sColor }}>
                            {row.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom nav */}
            <div className="pt-4 pb-5 flex-shrink-0">
              <BottomNav active={activeNav}
                onSelect={(i) => { setActiveNav(i); onNavigate?.(i); }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}