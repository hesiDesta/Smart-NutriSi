import React, { useState } from 'react';

const ChevLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const LANGUAGES = [
  { code: 'id', name: 'Bahasa Indonesia', native: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English',          native: 'Inggris',   flag: '🇬🇧' },
  { code: 'jw', name: 'Basa Jawa',        native: 'Jawa',      flag: '🏳️' },
  { code: 'su', name: 'Basa Sunda',       native: 'Sunda',     flag: '🏳️' },
  { code: 'ms', name: 'Bahasa Melayu',    native: 'Melayu',    flag: '🇲🇾' },
];

export default function Bahasa({ onBack }) {
  const [selected, setSelected] = useState(() => localStorage.getItem('nutrisi_lang') || 'id');
  const [showSaved, setShowSaved] = useState(false);

  const handleSelect = (code) => {
    setSelected(code);
    localStorage.setItem('nutrisi_lang', code);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 1800);
  };

  return (
    <div className="font-['Poppins'] bg-pink-base min-h-screen pb-10">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <button onClick={onBack}
          className="flex items-center gap-1 text-gray-500 text-[13px] font-medium hover:text-[#f2658f] transition-colors">
          <ChevLeft /> Kembali
        </button>
        <h1 className="text-[#f2658f] font-bold text-[20px] tracking-tight">Bahasa</h1>
        <div className="w-16" />
      </div>

      {/* Description */}
      <div className="px-5 mb-5">
        <p className="text-gray-600 text-[13px] leading-relaxed">
          Pilih bahasa yang ingin digunakan dalam aplikasi NutriSi. Pengaturan ini akan tersimpan otomatis.
        </p>
      </div>

      {/* Language list */}
      <div className="px-5">
        <div className="bg-white rounded-[18px] shadow-sm border border-gray-50 overflow-hidden">
          {LANGUAGES.map((lang, i) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center justify-between py-4 px-5
                          ${i !== LANGUAGES.length - 1 ? 'border-b border-gray-50' : ''}
                          hover:bg-pink-50/40 transition-colors`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[24px]">{lang.flag}</span>
                <div className="text-left">
                  <p className="text-gray-800 font-semibold text-[14px]">{lang.name}</p>
                  <p className="text-gray-400 text-[11px] font-medium">{lang.native}</p>
                </div>
              </div>
              {selected === lang.code && (
                <span className="text-[#f2658f]"><CheckIcon /></span>
              )}
            </button>
          ))}
        </div>

        {/* Info card */}
        <div className="mt-5 bg-[#fce4ec]/60 border border-[#f2658f]/20 rounded-[14px] px-4 py-3">
          <p className="text-[#f2658f] font-semibold text-[12px] mb-1">ℹ️ Catatan</p>
          <p className="text-gray-600 text-[12px] leading-relaxed">
            Saat ini hanya Bahasa Indonesia yang didukung penuh. Bahasa lain sedang dalam pengembangan dan akan tersedia pada update berikutnya.
          </p>
        </div>
      </div>

      {/* Toast saved */}
      {showSaved && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#f2658f] text-white
                        px-5 py-2.5 rounded-full shadow-lg text-[13px] font-semibold
                        anim-fade-up z-50">
          ✓ Bahasa disimpan
        </div>
      )}
    </div>
  );
}