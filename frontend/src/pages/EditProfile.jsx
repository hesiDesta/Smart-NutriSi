import logoImg from '../assets/logo.png';
import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ═══════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════ */
const ChevLeft    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const CameraIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const TrashIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>;
const SaveIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const UserIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const CalIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const RulerIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21.3 8.7L8.7 21.3a2.12 2.12 0 01-3 0L2.7 18.3a2.12 2.12 0 010-3L15.3 2.7a2.12 2.12 0 013 0l3 3a2.12 2.12 0 010 3z"/><line x1="7.5" y1="10.5" x2="9" y2="9"/><line x1="10.5" y1="13.5" x2="12" y2="12"/><line x1="13.5" y1="16.5" x2="15" y2="15"/></svg>;
const WeightIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="3"/><path d="M6.5 8a2 2 0 00-1.905 1.38L2 17h20l-2.595-7.62A2 2 0 0017.5 8h-11z"/></svg>;
const MailIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const PhoneIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.1a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
const CheckIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;

/* ── Bottom Nav ── */
const HomeIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const ClockIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 7v5l3 3"/></svg>;
const MenuIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
const RobotIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1" fill="currentColor"/><circle cx="9" cy="13" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1.2" fill="currentColor" stroke="none"/><path d="M9.5 16.5h5"/></svg>;
const PlusIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const PersonIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;

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

/* ── Input Field ── */
function InputField({ label, icon, value, onChange, type = 'text', suffix, placeholder }) {
  return (
    <div>
      <label className="block text-gray-500 text-[11px] font-semibold mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative flex items-center">
        <span className="absolute left-3.5 text-[#f2658f]">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-3 rounded-[14px] border-2 border-gray-100
                     bg-white text-gray-800 text-[14px] font-medium
                     focus:outline-none focus:border-[#f2658f] transition-colors
                     placeholder:text-gray-300"
        />
        {suffix && (
          <span className="absolute right-3.5 text-gray-400 text-[12px] font-semibold">{suffix}</span>
        )}
      </div>
    </div>
  );
}

/* ── Select Field ── */
function SelectField({ label, icon, value, onChange, options }) {
  return (
    <div>
      <label className="block text-gray-500 text-[11px] font-semibold mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative flex items-center">
        <span className="absolute left-3.5 text-[#f2658f]">{icon}</span>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-[14px] border-2 border-gray-100
                     bg-white text-gray-800 text-[14px] font-medium appearance-none
                     focus:outline-none focus:border-[#f2658f] transition-colors cursor-pointer"
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="absolute right-3.5 text-gray-400 pointer-events-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </div>
    </div>
  );
}

/* ── Multi-Select Pills ── */
function PillSelect({ label, options, selected, onToggle }) {
  return (
    <div>
      <label className="block text-gray-500 text-[11px] font-semibold mb-2 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const active = selected.includes(opt);
          return (
            <button key={opt} onClick={() => onToggle(opt)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all duration-150
                ${active
                  ? 'bg-[#f2658f] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-pink-50 hover:text-[#f2658f]'}`}>
              {active && <span className="mr-1">✓</span>}{opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function EditProfile({ onBack, onNavigate, onSave }) {
  const { user, updateProfile } = useAuth();
  const [activeNav, setActiveNav] = useState(4);
  const fileRef = useRef(null);

  const child = user?.childProfile;

  /* ── State form ── */
  const [photo, setPhoto]         = useState(() => {
    return localStorage.getItem(`nutrisi_photo_${user?.id}`) || null;
  });
  const [namaAnak, setNamaAnak]   = useState(child?.namaAnak || '');
  const [namaOrtu, setNamaOrtu]   = useState(user?.parentName || '');
  const [email, setEmail]         = useState(user?.username || '');
  const [telepon, setTelepon]     = useState(user?.telepon || '');
  const [tglLahir, setTglLahir]   = useState(child?.tanggalLahir || '');
  const [jenkel, setJenkel]       = useState(child?.jenisKelamin || 'perempuan');
  const [tinggi, setTinggi]       = useState(child?.tinggiBadan || '');
  const [berat, setBerat]         = useState(child?.beratBadan || '');
  const [alergi, setAlergi]       = useState(() => {
    return child?.alergi ? child.alergi.split(',').map(a => a.trim()).filter(Boolean) : [];
  });
  const [kondisi, setKondisi]     = useState(() => {
    return child?.kondisiKhusus ? child.kondisiKhusus.split(',').map(k => k.trim()).filter(Boolean) : [];
  });
  const [saved, setSaved]         = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [photoHover, setPhotoHover] = useState(false);

  const ALERGI_OPTS  = ['Susu', 'Telur', 'Seafood', 'Kacang', 'Gluten', 'Kedelai', 'Gandum', 'Lainnya'];
  const KONDISI_OPTS = ['Picky Eater', 'Diabetes', 'Stunting', 'Obesitas', 'Anemia', 'Autisme', 'Lainnya'];
  const JENKEL_OPTS  = [{ value: 'perempuan', label: 'Perempuan' }, { value: 'laki', label: 'Laki-laki' }];

  const toggleAlergi  = (v) => { setApiError(''); setAlergi(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]); };
  const toggleKondisi = (v) => { setApiError(''); setKondisi(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]); };

  /* ── Photo upload handler ── */
  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  /* ── Save handler ── */
  const handleSave = async () => {
    if (!namaAnak.trim()) {
      setApiError('Nama anak tidak boleh kosong.');
      return;
    }
    if (!tglLahir || !jenkel) {
      setApiError('Tanggal lahir dan jenis kelamin wajib diisi.');
      return;
    }
    if (!tinggi || !berat) {
      setApiError('Tinggi dan berat badan wajib diisi.');
      return;
    }

    setApiLoading(true);
    setApiError('');
    try {
      const payload = {
        namaAnak: namaAnak.trim(),
        tanggalLahir: tglLahir,
        jenisKelamin: jenkel,
        tinggiBadan: parseFloat(tinggi),
        beratBadan: parseFloat(berat),
        alergi: alergi.length > 0 ? alergi.join(', ') : 'Lainnya',
        kondisiKhusus: kondisi.length > 0 ? kondisi.join(', ') : 'Lainnya',
        parentName: namaOrtu.trim()
      };
      
      const res = await api.personalize(payload);
      if (photo) {
        localStorage.setItem(`nutrisi_photo_${user?.id}`, photo);
      } else {
        localStorage.removeItem(`nutrisi_photo_${user?.id}`);
      }
      updateProfile(res.childProfile, res.akgTargets, res.parentName);
      setSaved(true);
      setTimeout(() => { setSaved(false); onSave?.(); }, 1400);
    } catch (err) {
      setApiError(err.message || 'Gagal menyimpan perubahan.');
    } finally {
      setApiLoading(false);
    }
  };

  /* ── Avatar display ── */
  const renderAvatarArea = () => (
    <div className="flex flex-col items-center py-6">
      <div className="relative"
           onMouseEnter={() => setPhotoHover(true)}
           onMouseLeave={() => setPhotoHover(false)}>
        {/* Ring gradient */}
        <div className="w-[100px] h-[100px] rounded-full p-[3px] bg-gradient-to-br from-[#f2658f] to-[#f39ab4] shadow-lg">
          {photo ? (
            <img src={photo} alt="avatar"
                 className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#f2658f] to-[#f39ab4] flex items-center justify-center">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Hover overlay */}
        {photoHover && photo && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center cursor-pointer"
               onClick={() => fileRef.current?.click()}>
            <CameraIcon />
          </div>
        )}

        {/* Camera button */}
        <button onClick={() => fileRef.current?.click()}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#f2658f]
                     flex items-center justify-center shadow-md hover:bg-[#d94876]
                     transition-colors border-2 border-white">
          <CameraIcon />
        </button>
      </div>

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />

      {/* Action buttons */}
      <div className="flex items-center gap-3 mt-4">
        <button onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f2658f] text-white
                     text-[12px] font-semibold shadow-sm hover:bg-[#d94876] transition-colors">
          <CameraIcon /> Ganti Foto
        </button>
        {photo && (
          <button onClick={() => setPhoto(null)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 text-red-400
                       text-[12px] font-semibold hover:bg-red-100 transition-colors">
            <TrashIcon /> Hapus
          </button>
        )}
      </div>
      <p className="text-gray-400 text-[11px] mt-2">JPG, PNG, atau GIF · Maks 5 MB</p>
    </div>
  );

  /* ── Section header ── */
  const renderSectionHeader = (title, emoji) => (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-lg">{emoji}</span>
      <h2 className="text-gray-700 font-bold text-[14px]">{title}</h2>
      <div className="flex-1 h-px bg-gray-100 ml-1" />
    </div>
  );

  /* ── Save button ── */
  const renderSaveButton = (full) => (
    <button 
      onClick={handleSave}
      disabled={apiLoading}
      className={`${full ? 'w-full' : 'px-6'} flex items-center justify-center gap-2
                  py-3.5 rounded-[16px] font-bold text-[15px] transition-all duration-300 shadow-md
                  disabled:opacity-75 disabled:cursor-not-allowed
                  ${saved
                    ? 'bg-green-500 text-white scale-95'
                    : 'bg-[#f2658f] text-white hover:bg-[#d94876] hover:shadow-lg active:scale-95'}`}>
      {apiLoading ? 'Menyimpan...' : saved ? <><CheckIcon /> Tersimpan!</> : <><SaveIcon /> Simpan Perubahan</>}
    </button>
  );

  /* ── Form content ── */
  const renderFormContent = (compact) => (
    <div className={`flex flex-col ${compact ? 'gap-4' : 'gap-5'}`}>

      {/* Data Anak */}
      <div className="bg-white rounded-[18px] px-5 py-5 shadow-sm border border-gray-50">
        {renderSectionHeader("Data Anak", "👧")}
        <div className="flex flex-col gap-3.5">
          <InputField label="Nama Anak" icon={<UserIcon />} value={namaAnak}
            onChange={setNamaAnak} placeholder="Nama lengkap anak" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Tanggal Lahir" icon={<CalIcon />} value={tglLahir}
              onChange={setTglLahir} type="date" />
            <SelectField label="Jenis Kelamin" icon={<UserIcon />} value={jenkel}
              onChange={setJenkel} options={JENKEL_OPTS} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Tinggi Badan" icon={<RulerIcon />} value={tinggi}
              onChange={setTinggi} type="number" suffix="cm" placeholder="0" />
            <InputField label="Berat Badan" icon={<WeightIcon />} value={berat}
              onChange={setBerat} type="number" suffix="kg" placeholder="0" />
          </div>
        </div>
      </div>

      {/* Data Orang Tua */}
      <div className="bg-white rounded-[18px] px-5 py-5 shadow-sm border border-gray-50">
        {renderSectionHeader("Data Orang Tua", "👨‍👩‍👧")}
        <div className="flex flex-col gap-3.5">
          <InputField label="Nama Orang Tua" icon={<UserIcon />} value={namaOrtu}
            onChange={setNamaOrtu} placeholder="Nama orang tua / wali" />
          <InputField label="Email" icon={<MailIcon />} value={email}
            onChange={setEmail} type="email" placeholder="email@contoh.com" />
          <InputField label="No. Telepon" icon={<PhoneIcon />} value={telepon}
            onChange={setTelepon} type="tel" placeholder="08xxxxxxxxxx" />
        </div>
      </div>

      {/* Kondisi & Alergi */}
      <div className="bg-white rounded-[18px] px-5 py-5 shadow-sm border border-gray-50">
        {renderSectionHeader("Kondisi & Alergi", "🩺")}
        <div className="flex flex-col gap-4">
          <PillSelect label="Alergi Makanan" options={ALERGI_OPTS}
            selected={alergi} onToggle={toggleAlergi} />
          <PillSelect label="Kondisi Khusus" options={KONDISI_OPTS}
            selected={kondisi} onToggle={toggleKondisi} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-['Poppins']">
      {/* ═══════════════ MOBILE ═══════════════ */}
      <div className="lg:hidden flex flex-col bg-pink-base min-h-screen">
        <div className="flex-1 overflow-y-auto pb-32">

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-6 pb-2">
            <button onClick={onBack}
              className="flex items-center gap-1 text-gray-500 text-[13px] font-medium hover:text-[#f2658f] transition-colors">
              <ChevLeft /> Kembali
            </button>
            <h1 className="text-[#f2658f] font-bold text-[20px] tracking-tight">Edit Profile</h1>
            <div className="w-16" />
          </div>

          {/* Avatar */}
          <div className="anim-fade-up anim-d0">
            {renderAvatarArea()}
          </div>

          {/* Form */}
          <div className="px-5 flex flex-col gap-3 anim-fade-up anim-d1">
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-center flex items-center gap-2 justify-center">
                <span>⚠️</span>
                <span>{apiError}</span>
              </div>
            )}
            {renderFormContent(false)}
            {renderSaveButton(true)}
            <div className="h-2" />
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
            <h1 className="text-[#f2658f] font-bold text-[22px] tracking-tight">— Edit Profile</h1>
          </div>
          {renderSaveButton(false)}
        </div>

        {/* Body: two columns */}
        <div className="flex flex-1 min-h-0 px-10 xl:px-14 pb-0 gap-6">

          {/* KIRI: Avatar */}
          <div className="w-[36%] xl:w-[32%] h-full flex flex-col pb-6 anim-fade-left anim-d1">
            <div className="bg-white rounded-[22px] shadow-sm border border-gray-50 flex flex-col items-center overflow-hidden">
              {renderAvatarArea()}
              {/* Preview info */}
              <div className="w-full px-5 pb-5">
                <div className="bg-pink-50 rounded-[14px] p-4 text-center">
                  <p className="text-gray-800 font-bold text-[16px]">{namaAnak || '—'}</p>
                  <p className="text-gray-400 text-[12px] mt-0.5">Orang tua: {namaOrtu || '—'}</p>
                  {(tinggi || berat) && (
                    <div className="flex justify-center gap-3 mt-2">
                      {tinggi && <span className="text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded-full">📏 {tinggi} cm</span>}
                      {berat  && <span className="text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded-full">⚖️ {berat} kg</span>}
                    </div>
                  )}
                  {alergi.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {alergi.slice(0, 3).map(a => (
                        <span key={a} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fce4ec] text-[#f2658f]">{a}</span>
                      ))}
                      {alergi.length > 3 && <span className="text-[10px] text-gray-400">+{alergi.length-3}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* KANAN: Form */}
          <div className="flex-1 h-full flex flex-col px-4 pb-6 anim-fade-right anim-d2">
            
            {/* Scrollable Upper Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1 pb-2">
              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-center flex items-center gap-2 justify-center">
                  <span>⚠️</span>
                  <span>{apiError}</span>
                </div>
              )}
              {renderFormContent(true)}
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