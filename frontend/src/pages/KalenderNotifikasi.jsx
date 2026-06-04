import logoImg from '../assets/logo.png';
import React, { useState } from 'react';

/* ═══════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════ */
const ChevLeft    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevRight2  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const BellIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>;
const BellFill    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>;
const PlusIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6"/></svg>;
const ClockIcon2  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 7v5l3 3"/></svg>;
const CalIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const RepeatIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>;
const XIcon       = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const CheckIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;

/* ── Bottom Nav ── */
const HomeIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const ClockNavIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 7v5l3 3"/></svg>;
const MenuIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
const PersonIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;

function BottomNav({ active = 3, onSelect }) {
  const items = [HomeIcon, ClockNavIcon, MenuIcon, PersonIcon];
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

/* ═══ CONSTANTS ═══ */
const HARI   = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const BULAN  = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const REPEAT_OPTS = [
  { value:'sekali',  label:'Sekali' },
  { value:'harian',  label:'Setiap Hari' },
  { value:'mingguan',label:'Setiap Minggu' },
  { value:'bulanan', label:'Setiap Bulan' },
];
const NOTIF_COLORS = ['#f2658f','#8B5CF6','#22C55E','#F97316','#3B82F6','#EC4899'];
const NOTIF_TEMPLATES = [
  { emoji:'🍽️', label:'Waktu Makan',      jam:'07:00', warna:'#f2658f' },
  { emoji:'💊', label:'Minum Vitamin',    jam:'08:00', warna:'#8B5CF6' },
  { emoji:'💧', label:'Minum Air',        jam:'10:00', warna:'#3B82F6' },
  { emoji:'🥗', label:'Makan Siang',      jam:'12:00', warna:'#22C55E' },
  { emoji:'📊', label:'Catat Nutrisi',    jam:'19:00', warna:'#F97316' },
  { emoji:'🌙', label:'Rekap Harian',     jam:'21:00', warna:'#EC4899' },
];

/* ═══ Initial notifications ═══ */
const INIT_NOTIFS = [
  { id:1, emoji:'🍽️', label:'Sarapan Pagi',    jam:'07:00', repeat:'harian',  warna:'#f2658f',  aktif:true,  tanggal:null },
  { id:2, emoji:'💊', label:'Minum Vitamin C', jam:'08:30', repeat:'harian',  warna:'#8B5CF6',  aktif:true,  tanggal:null },
  { id:3, emoji:'🥗', label:'Makan Siang',     jam:'12:00', repeat:'harian',  warna:'#22C55E',  aktif:false, tanggal:null },
  { id:4, emoji:'📊', label:'Catat Nutrisi',   jam:'19:00', repeat:'mingguan',warna:'#F97316',  aktif:true,  tanggal:'2025-06-10' },
];

/* ═══════════════════════════════════════════════════════
   HELPER: build calendar grid
   ═══════════════════════════════════════════════════════ */
function buildCalGrid(year, month) {
  const first   = new Date(year, month, 1).getDay();
  const days    = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells = [];

  // Prev month filler
  for (let i = first - 1; i >= 0; i--) cells.push({ day: prevDays - i, cur: false });
  // Current month
  for (let d = 1; d <= days; d++)      cells.push({ day: d, cur: true });
  // Next month filler
  const rem = 42 - cells.length;
  for (let d = 1; d <= rem; d++)       cells.push({ day: d, cur: false });

  return cells;
}

/* ═══════════════════════════════════════════════════════
   TOGGLE SWITCH
   ═══════════════════════════════════════════════════════ */
function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle}
      className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0
                  ${on ? 'bg-[#f2658f]' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300
                        ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   MODAL TAMBAH / EDIT NOTIFIKASI
   ═══════════════════════════════════════════════════════ */
function ModalNotif({ onClose, onSave, initial, selectedDate }) {
  const [emoji, setEmoji]   = useState(initial?.emoji  || '🔔');
  const [label, setLabel]   = useState(initial?.label  || '');
  const [jam,   setJam]     = useState(initial?.jam    || '08:00');
  const [repeat,setRepeat]  = useState(initial?.repeat || 'harian');
  const [warna, setWarna]   = useState(initial?.warna  || '#f2658f');
  const [tanggal,setTanggal]= useState(
    initial?.tanggal || (selectedDate ? selectedDate.toISOString().split('T')[0] : '')
  );

  const EMOJIS = ['🔔','🍽️','💊','💧','🥗','📊','🌙','🏃','🧘','🍎','🥛','⏰'];

  const handleSave = () => {
    if (!label.trim()) return;
    onSave({ emoji, label: label.trim(), jam, repeat, warna, tanggal: tanggal || null });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-[28px] sm:rounded-[28px] w-full sm:max-w-md
                      p-6 pb-8 shadow-2xl anim-slide-up z-10">
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-800 font-bold text-[18px]">
            {initial ? 'Edit Notifikasi' : 'Tambah Notifikasi'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XIcon />
          </button>
        </div>

        {/* Templates */}
        {!initial && (
          <div className="mb-5">
            <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-2">Template Cepat</p>
            <div className="grid grid-cols-3 gap-2">
              {NOTIF_TEMPLATES.map((t) => (
                <button key={t.label} onClick={() => { setEmoji(t.emoji); setLabel(t.label); setJam(t.jam); setWarna(t.warna); }}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-[12px] bg-gray-50
                             hover:bg-pink-50 border-2 border-transparent hover:border-[#f2658f]/30
                             transition-all text-left">
                  <span className="text-[16px]">{t.emoji}</span>
                  <span className="text-gray-700 text-[11px] font-semibold leading-tight">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Emoji picker */}
        <div className="mb-4">
          <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-2">Ikon</p>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button key={e} onClick={() => setEmoji(e)}
                className={`w-9 h-9 rounded-[10px] text-lg flex items-center justify-center transition-all
                            ${emoji === e ? 'bg-[#f2658f]/15 ring-2 ring-[#f2658f] scale-110' : 'bg-gray-50 hover:bg-gray-100'}`}>
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Label */}
        <div className="mb-4">
          <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-2">Nama Notifikasi</p>
          <input value={label} onChange={e => setLabel(e.target.value)}
            placeholder="cth: Sarapan Pagi, Minum Vitamin..."
            className="w-full px-4 py-3 rounded-[14px] border-2 border-gray-100 bg-gray-50
                       text-gray-800 text-[14px] font-medium focus:outline-none focus:border-[#f2658f]
                       transition-colors placeholder:text-gray-300" />
        </div>

        {/* Jam & Repeat */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-2">Jam</p>
            <input type="time" value={jam} onChange={e => setJam(e.target.value)}
              className="w-full px-4 py-3 rounded-[14px] border-2 border-gray-100 bg-gray-50
                         text-gray-800 text-[14px] font-medium focus:outline-none focus:border-[#f2658f]
                         transition-colors cursor-pointer" />
          </div>
          <div>
            <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-2">Pengulangan</p>
            <select value={repeat} onChange={e => setRepeat(e.target.value)}
              className="w-full px-3 py-3 rounded-[14px] border-2 border-gray-100 bg-gray-50
                         text-gray-800 text-[13px] font-medium focus:outline-none focus:border-[#f2658f]
                         transition-colors cursor-pointer appearance-none">
              {REPEAT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Tanggal (optional) */}
        {(repeat === 'sekali') && (
          <div className="mb-4">
            <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-2">Tanggal</p>
            <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)}
              className="w-full px-4 py-3 rounded-[14px] border-2 border-gray-100 bg-gray-50
                         text-gray-800 text-[14px] font-medium focus:outline-none focus:border-[#f2658f]
                         transition-colors cursor-pointer" />
          </div>
        )}

        {/* Warna */}
        <div className="mb-6">
          <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-2">Warna</p>
          <div className="flex gap-2.5">
            {NOTIF_COLORS.map(c => (
              <button key={c} onClick={() => setWarna(c)}
                className={`w-8 h-8 rounded-full transition-all ${warna === c ? 'scale-125 shadow-md' : 'hover:scale-110'}`}
                style={{ backgroundColor: c }}>
                {warna === c && (
                  <span className="flex items-center justify-center text-white"><CheckIcon /></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3.5 rounded-[16px] border-2 border-gray-100 text-gray-500
                       font-bold text-[14px] hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button onClick={handleSave}
            disabled={!label.trim()}
            className="flex-1 py-3.5 rounded-[16px] bg-[#f2658f] text-white font-bold text-[14px]
                       hover:bg-[#d94876] transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed">
            {initial ? 'Simpan' : 'Tambah'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NOTIFICATION CARD
   ═══════════════════════════════════════════════════════ */
function NotifCard({ notif, onToggle, onDelete, onEdit }) {
  const repeatLabel = REPEAT_OPTS.find(r => r.value === notif.repeat)?.label || notif.repeat;
  return (
    <div className={`bg-white rounded-[16px] px-4 py-3.5 shadow-sm border transition-all duration-200
                     ${notif.aktif ? 'border-gray-50' : 'border-gray-50 opacity-60'}`}>
      <div className="flex items-center gap-3">
        {/* Emoji badge */}
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 text-xl shadow-sm"
             style={{ backgroundColor: notif.warna + '22' }}>
          {notif.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 font-bold text-[14px] leading-tight truncate">{notif.label}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-gray-400 text-[11px]">
              <ClockIcon2 /> {notif.jam}
            </span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1 text-gray-400 text-[11px]">
              <RepeatIcon /> {repeatLabel}
            </span>
            {notif.tanggal && (
              <>
                <span className="text-gray-300">·</span>
                <span className="flex items-center gap-1 text-gray-400 text-[11px]">
                  <CalIcon /> {new Date(notif.tanggal).toLocaleDateString('id-ID', { day:'numeric', month:'short' })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => onEdit(notif)}
            className="w-7 h-7 rounded-full bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-400
                       flex items-center justify-center transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button onClick={() => onDelete(notif.id)}
            className="w-7 h-7 rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-400
                       flex items-center justify-center transition-colors">
            <TrashIcon />
          </button>
          <Toggle on={notif.aktif} onToggle={() => onToggle(notif.id)} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function KalenderNotifikasi({ onBack, onNavigate }) {
  const today = new Date();
  const [activeNav, setActiveNav]     = useState(3);
  const [viewYear, setViewYear]       = useState(today.getFullYear());
  const [viewMonth, setViewMonth]     = useState(today.getMonth());
  const [selDate, setSelDate]         = useState(today);
  const [notifs, setNotifs]           = useState(INIT_NOTIFS);
  const [showModal, setShowModal]     = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [globalOn, setGlobalOn]       = useState(true);
  const [nextId, setNextId]           = useState(10);
  const [tab, setTab]                 = useState('kalender');

  const cells = buildCalGrid(viewYear, viewMonth);

  /* ── Helpers ── */
  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); }
    else setViewMonth(m => m-1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); }
    else setViewMonth(m => m+1);
  };

  const isSameDay = (d1, d2) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  const isToday = (day, cur) => cur && day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isSelected = (day, cur) => cur && selDate && day === selDate.getDate() && viewMonth === selDate.getMonth() && viewYear === selDate.getFullYear();

  const notifsOnDay = (day, cur) => {
    if (!cur) return [];
    const d = new Date(viewYear, viewMonth, day);
    return notifs.filter(n => n.tanggal && isSameDay(new Date(n.tanggal), d));
  };

  const hasNotif = (day, cur) => {
    const daily = notifs.filter(n => n.repeat === 'harian' && n.aktif);
    return cur && (daily.length > 0 || notifsOnDay(day, cur).length > 0);
  };

  const toggleNotif = (id) => setNotifs(p => p.map(n => n.id === id ? { ...n, aktif: !n.aktif } : n));
  const deleteNotif = (id) => setNotifs(p => p.filter(n => n.id !== id));
  const saveNotif = (data) => {
    if (editTarget) {
      setNotifs(p => p.map(n => n.id === editTarget.id ? { ...n, ...data } : n));
    } else {
      setNotifs(p => [...p, { id: nextId, aktif: true, ...data }]);
      setNextId(i => i+1);
    }
    setEditTarget(null);
    setShowModal(false);
  };

  const selectedDateNotifs = notifs.filter(n => {
    if (n.repeat === 'harian') return true;
    if (n.tanggal && isSameDay(new Date(n.tanggal), selDate)) return true;
    if (n.repeat === 'mingguan' && selDate.getDay() === (n.tanggal ? new Date(n.tanggal).getDay() : 1)) return true;
    return false;
  });

  const activeCount = notifs.filter(n => n.aktif).length;

  const renderCalendarGrid = () => (
    <div className="bg-white rounded-[20px] px-5 py-5 shadow-sm border border-gray-50">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-pink-50 flex items-center justify-center text-[#f2658f] transition-colors"><ChevLeft /></button>
        <h2 className="text-gray-800 font-bold text-[15px]">{BULAN[viewMonth]} {viewYear}</h2>
        <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-pink-50 flex items-center justify-center text-[#f2658f] transition-colors"><ChevRight2 /></button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {HARI.map(h => <div key={h} className={`text-center text-[11px] font-bold py-1 ${h === 'Min' ? 'text-[#f2658f]' : 'text-gray-400'}`}>{h}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((c, i) => {
          const todayCell = isToday(c.day, c.cur);
          const selectedCell = isSelected(c.day, c.cur);
          const hasN = hasNotif(c.day, c.cur);
          const dayNotifs = notifsOnDay(c.day, c.cur);
          const isSun = i % 7 === 0;
          return (
            <button key={i} onClick={() => c.cur && setSelDate(new Date(viewYear, viewMonth, c.day))} className={`relative flex flex-col items-center justify-center h-10 rounded-full text-[13px] font-semibold transition-all duration-150 ${!c.cur ? 'text-gray-200 cursor-default' : 'cursor-pointer'} ${selectedCell ? 'bg-[#f2658f] text-white shadow-md scale-110' : ''} ${todayCell && !selectedCell ? 'bg-[#fce4ec] text-[#f2658f]' : ''} ${c.cur && !todayCell && !selectedCell ? (isSun ? 'text-[#f2658f] hover:bg-pink-50' : 'text-gray-700 hover:bg-gray-50') : ''}`}>
              {c.day}
              {hasN && c.cur && !selectedCell && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#f2658f]" />}
              {dayNotifs.length > 0 && <span className="absolute top-0.5 right-1 w-3.5 h-3.5 rounded-full bg-[#8B5CF6] text-white text-[8px] font-bold flex items-center justify-center">{dayNotifs.length}</span>}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#f2658f]" /><span className="text-gray-400 text-[11px]">Ada notifikasi</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-[#8B5CF6] text-white text-[8px] font-bold flex items-center justify-center">1</div><span className="text-gray-400 text-[11px]">Notif spesifik</span></div>
      </div>
    </div>
  );

  const renderDatePanel = () => (
    <div className="bg-white rounded-[20px] px-5 py-4 shadow-sm border border-gray-50">
      <div className="flex items-center justify-between mb-3">
        <div><p className="text-gray-800 font-bold text-[15px]">{selDate.toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long' })}</p><p className="text-gray-400 text-[11px] mt-0.5">{selectedDateNotifs.length} notifikasi aktif</p></div>
        <button onClick={() => { setEditTarget(null); setShowModal(true); }} className="flex items-center gap-1 px-3.5 py-2 rounded-full bg-[#f2658f] text-white text-[12px] font-bold hover:bg-[#d94876] transition-colors shadow-sm"><PlusIcon /> Tambah</button>
      </div>
      {selectedDateNotifs.length === 0 ? <div className="py-8 text-center"><span className="text-4xl">🔕</span><p className="text-gray-400 text-[13px] font-medium mt-2">Belum ada notifikasi</p></div> : <div className="flex flex-col gap-2">{selectedDateNotifs.map(n => <NotifCard key={n.id} notif={n} onToggle={toggleNotif} onDelete={deleteNotif} onEdit={(n) => { setEditTarget(n); setShowModal(true); }} />)}</div>}
    </div>
  );

  const renderAllNotifsPanel = () => (
    <div>
      {/* Global toggle */}
      <div className="bg-white rounded-[20px] px-5 py-4 shadow-sm border border-gray-50 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#fce4ec] flex items-center justify-center">
              {globalOn ? <BellFill /> : <BellIcon />}
            </div>
            <div>
              <p className="text-gray-800 font-bold text-[14px]">Semua Notifikasi</p>
              <p className="text-gray-400 text-[11px]">{activeCount} dari {notifs.length} aktif</p>
            </div>
          </div>
          <Toggle on={globalOn} onToggle={() => {
            setGlobalOn(v => {
              const newVal = !v;
              setNotifs(p => p.map(n => ({ ...n, aktif: newVal })));
              return newVal;
            });
          }} />
        </div>

        {/* Progress bar */}
        <div className="mt-3 bg-gray-100 rounded-full h-1.5">
          <div className="bg-[#f2658f] h-1.5 rounded-full transition-all duration-500"
               style={{ width: `${notifs.length ? (activeCount / notifs.length) * 100 : 0}%` }} />
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {notifs.map(n => (
          <NotifCard key={n.id} notif={n}
            onToggle={toggleNotif}
            onDelete={deleteNotif}
            onEdit={(n) => { setEditTarget(n); setShowModal(true); }} />
        ))}
        {notifs.length === 0 && (
          <div className="bg-white rounded-[20px] px-5 py-10 text-center shadow-sm border border-gray-50">
            <span className="text-4xl">🔔</span>
            <p className="text-gray-600 font-bold text-[15px] mt-3">Belum ada notifikasi</p>
            <p className="text-gray-400 text-[13px] mt-1">Tambahkan pengingat untuk nutrisi anak</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="font-['Poppins']">
      {/* ═══════════════ MOBILE ═══════════════ */}
      <div className="lg:hidden flex flex-col bg-pink-base min-h-screen">
        <div className="flex-1 overflow-y-auto pb-32">

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-6 pb-4">
            <button onClick={onBack}
              className="flex items-center gap-1 text-gray-500 text-[13px] font-medium hover:text-[#f2658f] transition-colors">
              <ChevLeft /> Kembali
            </button>
            <h1 className="text-[#f2658f] font-bold text-[20px] tracking-tight">Notifikasi</h1>
            <button onClick={() => { setEditTarget(null); setShowModal(true); }}
              className="w-9 h-9 rounded-full bg-[#f2658f] text-white flex items-center justify-center
                         shadow-md hover:bg-[#d94876] transition-colors">
              <PlusIcon />
            </button>
          </div>

          {/* Tab switcher */}
          <div className="px-5 mb-4 anim-fade-up anim-d0">
            <div className="bg-white rounded-[16px] p-1.5 flex gap-1 shadow-sm border border-gray-50">
              {[{ key:'kalender', label:'📅 Kalender' }, { key:'semua', label:'🔔 Semua' }].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex-1 py-2.5 rounded-[12px] font-bold text-[13px] transition-all
                              ${tab === t.key
                                ? 'bg-[#f2658f] text-white shadow-sm'
                                : 'text-gray-500 hover:text-[#f2658f]'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 flex flex-col gap-3 anim-fade-up anim-d1">
            {tab === 'kalender' ? (
              <>
                {renderCalendarGrid()}
                {renderDatePanel()}
              </>
            ) : (
              renderAllNotifsPanel()
            )}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 pb-5 pt-2 bg-gradient-to-t from-pink-100/80 to-transparent">
          <BottomNav active={activeNav}
            onSelect={(i) => { setActiveNav(i); onNavigate?.(i); }} />
        </div>
      </div>

      {/* ═══════════════ DESKTOP ═══════════════ */}
      <div className="hidden lg:flex flex-col h-screen bg-pink-base overflow-hidden border-l border-gray-100">

        <span className="absolute top-14 left-10  text-[#f2658f]/30 text-3xl select-none anim-twinkle pointer-events-none">✦</span>
        <span className="absolute top-40 right-14 text-[#f2658f]/25 text-2xl select-none anim-twinkle-b pointer-events-none">✦</span>
        <span className="absolute bottom-24 left-[34%] text-[#f2658f]/30 text-xl select-none anim-twinkle-c pointer-events-none">✦</span>

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
            <h1 className="text-[#f2658f] font-bold text-[22px] tracking-tight">— Kalender Notifikasi</h1>
          </div>
          <button onClick={() => { setEditTarget(null); setShowModal(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f2658f] text-white
                       font-bold text-[14px] hover:bg-[#d94876] transition-colors shadow-md">
            <PlusIcon /> Tambah Notifikasi
          </button>
        </div>

        {/* Body: two columns */}
        <div className="flex flex-1 min-h-0 px-10 xl:px-14 pb-0 gap-6">

          {/* KIRI: Kalender + tanggal terpilih */}
          <div className="w-[42%] xl:w-[40%] h-full flex flex-col pb-6 gap-4 overflow-y-auto anim-fade-left anim-d1">
            {renderCalendarGrid()}
            {renderDatePanel()}
          </div>

          {/* KANAN: Semua notifikasi */}
          <div className="flex-1 h-full flex flex-col px-4 pb-6 anim-fade-right anim-d2">
            
            {/* Scrollable Upper Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1 pb-2">
              <div>
                <p className="text-gray-700 font-bold text-[15px] mb-2.5 px-1">Semua Notifikasi</p>
                {renderAllNotifsPanel()}
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
      {showModal && (
        <ModalNotif
          onClose={() => { setShowModal(false); setEditTarget(null); }}
          onSave={saveNotif}
          initial={editTarget}
          selectedDate={selDate}
        />
      )}
    </div>
  );
}
