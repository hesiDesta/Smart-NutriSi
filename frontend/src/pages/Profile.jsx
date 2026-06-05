import logoImg from '../assets/logo.png';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

/* ═══════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════ */
const HomeIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const ClockIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 7v5l3 3"/></svg>;
const MenuIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
const RobotIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1" fill="currentColor"/><circle cx="9" cy="13" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1.2" fill="currentColor" stroke="none"/><path d="M9.5 16.5h5"/></svg>;
const PlusIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const PersonIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;
const ChevLeft   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevRight2 = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const EditIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const BellIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>;
const LangIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
const LockIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const HelpIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>;
const LogoutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
const CameraIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const StarIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="#f2658f"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

/* ── Bottom Nav ── */
function BottomNav({ active = 4, onSelect }) {
  const items = [HomeIcon, ClockIcon, PlusIcon, RobotIcon, PersonIcon];
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

/* ── Setting Row ── */
function SettingRow({ icon, label, value, onClick, danger }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center justify-between py-3.5 px-1
                  border-b border-gray-50 last:border-0
                  hover:bg-pink-50/30 rounded-xl transition-colors
                  ${danger ? 'text-red-500' : 'text-gray-700'}`}>
      <div className="flex items-center gap-3.5">
        <span className={`${danger ? 'text-red-400' : 'text-[#f2658f]'}`}>{icon}</span>
        <span className="font-semibold text-[14px]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-gray-400 text-[12px] font-medium">{value}</span>}
        <span className="text-gray-300"><ChevRight2 /></span>
      </div>
    </button>
  );
}

/* ── Alergi pill ── */
const ALERGI_PILLS = ['Susu', 'Telur', 'Seafood'];
const KONDISI_PILLS = ['Picky Eater'];

/* ── Avatar placeholder SVG ── */
const AvatarPlaceholder = ({ size = 80 }) => (
  <div className="rounded-full bg-gradient-to-br from-[#f2658f] to-[#f39ab4] flex items-center justify-center flex-shrink-0"
       style={{ width: size, height: size }}>
    <svg width={size*0.55} height={size*0.55} viewBox="0 0 24 24" fill="white">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function Profile({ onBack, onNavigate, onLogout, onEditProfile, onKalenderNotifikasi, onBahasa, onPrivasi, onBantuan }) {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState(4);
  const [notifOn,   setNotifOn]   = useState(true);
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState(() => {
    return localStorage.getItem(`nutrisi_photo_${user?.id}`) || null;
  });

  /* ── Stats dinamis dari history ── */
  const [stats, setStats] = useState({ hariTercatat: 0, rataAKG: 0, streak: 0 });

  useEffect(() => {
    let cancelled = false;
    const akgTarget = user?.akgTargets?.kkal || 1350;

    api.getHistory().then((history) => {
      if (cancelled || !Array.isArray(history)) return;

      const hariTercatat = history.length;

      let totalPersen = 0;
      history.forEach((h) => {
        totalPersen += Math.min((h.kkal / akgTarget) * 100, 100);
      });
      const rataAKG = hariTercatat > 0 ? Math.round(totalPersen / hariTercatat) : 0;

      const dateSet = new Set(history.map((h) => h.date));
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        if (dateSet.has(key)) streak++;
        else break;
      }

      if (!cancelled) setStats({ hariTercatat, rataAKG, streak });
    }).catch(() => {});

    return () => { cancelled = true; };
  }, [user?.id, user?.akgTargets?.kkal]);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPhoto(dataUrl);
      localStorage.setItem(`nutrisi_photo_${user?.id}`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const child = user?.childProfile;
  const childName = child?.namaAnak || 'Anak';
  const parentName = user?.parentName || 'Orang Tua';

  const calculateAge = (birthDateStr) => {
    if (!birthDateStr) return '0 bulan';
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }
    if (today.getDate() < birthDate.getDate()) {
      months--;
    }
    if (months < 0) {
      months += 12;
    }
    
    if (years > 0) {
      return `${years} tahun ${months} bulan`;
    } else {
      return `${months} bulan`;
    }
  };

  const ageStr = calculateAge(child?.tanggalLahir);

  /* ── Child info card ── */
  const renderChildCard = (compact) => {
    const allergyList = child?.alergi ? child.alergi.split(',').map(a => a.trim()).filter(Boolean) : [];
    const conditionList = child?.kondisiKhusus ? child.kondisiKhusus.split(',').map(k => k.trim()).filter(Boolean) : [];

    return (
      <div className={`bg-white rounded-[18px] shadow-sm border border-gray-50
                       ${compact ? 'px-5 py-4' : 'px-5 py-5'}`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-700 font-bold text-[14px]">Info Anak</p>
          <button onClick={onEditProfile} className="flex items-center gap-1 text-[#f2658f] text-[12px] font-semibold
                             hover:underline transition-colors">
            <EditIcon /> Edit
          </button>
        </div>
        <div className={`grid grid-cols-2 ${compact ? 'gap-3' : 'gap-4'}`}>
          {[
            { label:'Nama',          val: childName },
            { label:'Usia',          val: ageStr },
            { label:'Jenis Kelamin', val: child?.jenisKelamin ? (child.jenisKelamin === 'laki' ? 'Laki-laki' : 'Perempuan') : '-' },
            { label:'Tinggi Badan',  val: child?.tinggiBadan ? `${child.tinggiBadan} cm` : '-' },
            { label:'Berat Badan',   val: child?.beratBadan ? `${child.beratBadan} kg` : '-' },
            { label:'Status Gizi',   val: 'Normal ✅' },
          ].map(({ label, val }) => (
            <div key={label}>
              <p className="text-gray-400 text-[11px] font-medium">{label}</p>
              <p className="text-gray-800 font-semibold text-[13px] mt-0.5">{val}</p>
            </div>
          ))}
        </div>

        {/* Alergi & kondisi */}
        <div className="mt-3 pt-3 border-t border-gray-50">
          <p className="text-gray-400 text-[11px] font-medium mb-1.5">Alergi</p>
          <div className="flex flex-wrap gap-1.5">
            {allergyList.length > 0 ? (
              allergyList.map((a) => (
                <span key={a} className="text-[11px] font-bold px-2.5 py-1 rounded-full
                                         bg-[#fce4ec] text-[#f2658f]">{a}</span>
              ))
            ) : (
              <span className="text-gray-400 text-[11px] font-medium">Tidak ada alergi</span>
            )}
          </div>
        </div>
        <div className="mt-2.5">
          <p className="text-gray-400 text-[11px] font-medium mb-1.5">Kondisi Khusus</p>
          <div className="flex flex-wrap gap-1.5">
            {conditionList.length > 0 ? (
              conditionList.map((k) => (
                <span key={k} className="text-[11px] font-bold px-2.5 py-1 rounded-full
                                         bg-[#F5F3FF] text-[#8B5CF6]">{k}</span>
              ))
            ) : (
              <span className="text-gray-400 text-[11px] font-medium">Tidak ada kondisi khusus</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ── Stats row ── */
  const renderStatsRow = () => (
    <div className="grid grid-cols-3 gap-2.5">
      {[
        { val:String(stats.hariTercatat), label:'Hari Tercatat', color:'#f2658f', bg:'#fce4ec' },
        { val:`${stats.rataAKG}%`, label:'Rata-rata AKG', color:'#22C55E', bg:'#F0FDF4' },
        { val:String(stats.streak), label:'Hari Streak 🔥', color:'#F97316', bg:'#FFF7ED' },
      ].map((s) => (
        <div key={s.label} className="bg-white rounded-[14px] px-3 py-3 text-center shadow-sm border border-gray-50">
          <p className="font-bold text-[20px] leading-none" style={{ color: s.color }}>{s.val}</p>
          <p className="text-gray-400 text-[10px] font-medium mt-1 leading-tight">{s.label}</p>
        </div>
      ))}
    </div>
  );

  /* ── Settings list ── */
  const renderSettingsList = () => (
    <div className="bg-white rounded-[18px] px-4 py-2 shadow-sm border border-gray-50">
      <SettingRow icon={<BellIcon />} label="Notifikasi"
        value={notifOn ? 'Aktif' : 'Nonaktif'}
        onClick={() => onKalenderNotifikasi?.()} />
      <SettingRow icon={<LangIcon />} label="Bahasa" value="Bahasa Indonesia" onClick={() => onBahasa?.()} />
      <SettingRow icon={<LockIcon />} label="Privasi & Keamanan" onClick={() => onPrivasi?.()} />
      <SettingRow icon={<HelpIcon />} label="Bantuan & FAQ" onClick={() => onBantuan?.()} />
    </div>
  );

  /* ── Logout ── */
  const renderLogoutBtn = () => (
    <div className="bg-white rounded-[18px] px-4 py-2 shadow-sm border border-gray-50">
      <SettingRow icon={<LogoutIcon />} label="Keluar" danger
        onClick={() => { logout(); onLogout?.(); }} />
    </div>
  );

  /* ── App version ── */
  const renderAppVer = () => (
    <p className="text-center text-gray-300 text-[11px] font-medium">
      NutriSi v1.0.0 · Made with ❤️ for kids
    </p>
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
            <h1 className="text-[#f2658f] font-bold text-[20px] tracking-tight">Profile</h1>
            <div className="w-16" />
          </div>

          {/* Avatar section */}
          <div className="flex flex-col items-center pb-5 pt-2 anim-fade-up anim-d0">
            {/* Avatar ring */}
            <div className="relative mb-3">
              <div onClick={() => fileRef.current?.click()}
                   className="w-[88px] h-[88px] rounded-full p-[3px] cursor-pointer overflow-hidden flex items-center justify-center
                              bg-gradient-to-br from-[#f2658f] to-[#f39ab4] shadow-lg">
                {photo ? (
                  <img src={photo} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <AvatarPlaceholder size={82} />
                )}
              </div>
              {/* Camera button */}
              <button onClick={() => fileRef.current?.click()}
                      className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#f2658f]
                                 flex items-center justify-center shadow-md
                                 hover:bg-[#d94876] transition-colors border border-white">
                <CameraIcon />
              </button>
            </div>

            {/* Nama & rating */}
            <p className="text-gray-800 font-bold text-[18px] leading-tight">{childName}</p>
            <p className="text-gray-400 text-[13px] mt-0.5">Orang tua: {parentName}</p>
            <div className="flex items-center gap-1 mt-1.5">
              {[1,2,3,4,5].map((s) => <StarIcon key={s} />)}
              <span className="text-gray-400 text-[11px] ml-1 font-medium">Status gizi: Normal</span>
            </div>
            <button onClick={onEditProfile}
              className="mt-3 flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f2658f] text-white
                         text-[12px] font-bold shadow-sm hover:bg-[#d94876] transition-colors">
              <EditIcon /> Edit Profile
            </button>
          </div>

          {/* Content */}
          <div className="px-5 flex flex-col gap-3 anim-fade-up anim-d1">
            {renderStatsRow()}
            {renderChildCard(false)}
            {renderSettingsList()}
            {renderLogoutBtn()}
            {renderAppVer()}
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

        {/* Stars */}
        <span className="absolute top-14 left-10  text-[#f2658f]/30 text-3xl select-none anim-twinkle pointer-events-none">✦</span>
        <span className="absolute top-40 right-14 text-[#f2658f]/25 text-2xl select-none anim-twinkle-b pointer-events-none">✦</span>
        <span className="absolute bottom-24 left-[34%] text-[#f2658f]/30 text-xl select-none anim-twinkle-c pointer-events-none">✦</span>
        <span className="absolute bottom-20 right-20  text-[#f2658f]/25 text-lg select-none anim-twinkle-d pointer-events-none">✦</span>

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
            <h1 className="text-[#f2658f] font-bold text-[22px] tracking-tight">— Profile</h1>
          </div>
          <div className="w-20" />
        </div>

        {/* Body: two columns */}
        <div className="flex flex-1 min-h-0 px-10 xl:px-14 pb-0 gap-6">

          {/* KIRI: Avatar + ChildCard */}
          <div className="w-[42%] xl:w-[38%] h-full flex flex-col pb-6 gap-4 overflow-y-auto anim-fade-left anim-d1">

            {/* Profile card */}
            <div className="bg-white rounded-[22px] px-6 py-6 shadow-sm border border-gray-50 flex flex-col items-center">
              {/* Avatar */}
              <div className="relative mb-4">
                <div onClick={() => fileRef.current?.click()}
                     className="w-[100px] h-[100px] rounded-full p-[3px] cursor-pointer overflow-hidden flex items-center justify-center
                                bg-gradient-to-br from-[#f2658f] to-[#f39ab4] shadow-lg">
                  {photo ? (
                    <img src={photo} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <AvatarPlaceholder size={94} />
                  )}
                </div>
                <button onClick={() => fileRef.current?.click()}
                        className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#f2658f]
                                   flex items-center justify-center shadow-md hover:bg-[#d94876] transition-colors border-2 border-white">
                  <CameraIcon />
                </button>
              </div>

              <p className="text-gray-800 font-bold text-[20px]">{childName}</p>
              <p className="text-gray-400 text-[13px] mt-0.5">Orang tua: {parentName}</p>
              <div className="flex items-center gap-1 mt-2 mb-4">
                {[1,2,3,4,5].map((s) => <StarIcon key={s} />)}
                <span className="text-gray-400 text-[11px] ml-1 font-medium">Normal</span>
              </div>
              <button onClick={onEditProfile}
                className="mb-2 flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#f2658f] text-white
                           text-[13px] font-bold shadow-sm hover:bg-[#d94876] transition-colors">
                <EditIcon /> Edit Profile
              </button>

              {/* Stats horizontal */}
              <div className="flex w-full gap-2">
                {[
                  { val:String(stats.hariTercatat), label:'Hari', color:'#f2658f', bg:'#fce4ec' },
                  { val:`${stats.rataAKG}%`, label:'AKG', color:'#22C55E', bg:'#F0FDF4' },
                  { val:`${stats.streak}🔥`, label:'Streak', color:'#F97316', bg:'#FFF7ED' },
                ].map((s) => (
                  <div key={s.label} className="flex-1 rounded-[12px] px-2 py-2.5 text-center"
                       style={{ backgroundColor: s.bg }}>
                    <p className="font-bold text-[18px] leading-none" style={{ color: s.color }}>{s.val}</p>
                    <p className="text-gray-400 text-[10px] font-medium mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Child info card */}
            {renderChildCard(true)}
          </div>

          {/* KANAN: Settings + Logout */}
          <div className="flex-1 h-full flex flex-col px-4 pb-6 anim-fade-right anim-d2">
            
            {/* Scrollable Upper Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1 pb-2">
              {/* Pengaturan akun */}
              <div>
                <p className="text-gray-700 font-bold text-[15px] mb-2.5 px-1">Pengaturan</p>
                {renderSettingsList()}
              </div>

              {/* Bantuan */}
              <div>
                <p className="text-gray-700 font-bold text-[15px] mb-2.5 px-1">Lainnya</p>
                {renderLogoutBtn()}
              </div>

              {renderAppVer()}
            </div>

            {/* Bottom nav */}
            <div className="pt-4 pb-5 flex-shrink-0">
              <BottomNav active={activeNav}
                onSelect={(i) => { setActiveNav(i); onNavigate?.(i); }} />
            </div>
          </div>
        </div>
      </div>
      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
    </div>
  );
}