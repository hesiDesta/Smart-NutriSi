import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ChevLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const KeyIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

function Section({ icon, title, children }) {
  return (
    <div className="bg-white rounded-[18px] px-5 py-4 shadow-sm border border-gray-50 mb-3">
      <div className="flex items-center gap-2.5 mb-2.5">
        <span className="text-[#f2658f]">{icon}</span>
        <h3 className="text-gray-800 font-bold text-[14px]">{title}</h3>
      </div>
      <div className="text-gray-600 text-[12.5px] leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export default function Privasi({ onBack, onLogout }) {
  const { logout } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = () => {
    // Hapus data lokal (token dan foto)
    localStorage.clear();
    logout();
    onLogout?.();
  };

  return (
    <div className="font-['Poppins'] bg-pink-base min-h-screen pb-10">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <button onClick={onBack}
          className="flex items-center gap-1 text-gray-500 text-[13px] font-medium hover:text-[#f2658f] transition-colors">
          <ChevLeft /> Kembali
        </button>
        <h1 className="text-[#f2658f] font-bold text-[18px] tracking-tight">Privasi & Keamanan</h1>
        <div className="w-16" />
      </div>

      <div className="px-5">
        {/* Pengenalan */}
        <div className="bg-[#fce4ec]/60 border border-[#f2658f]/20 rounded-[14px] px-4 py-3 mb-4">
          <p className="text-[#f2658f] font-semibold text-[13px] mb-1">🔒 Keamanan Data Anda</p>
          <p className="text-gray-700 text-[12px] leading-relaxed">
            NutriSi menghormati privasi Anda dan keluarga. Berikut adalah informasi tentang bagaimana kami menjaga data Anda.
          </p>
        </div>

        <Section icon={<ShieldIcon />} title="Data yang Kami Simpan">
          Kami hanya menyimpan data yang Anda berikan saat registrasi dan personalisasi profil anak, yaitu: nama orang tua, email, profil anak (nama, tanggal lahir, tinggi, berat, alergi), dan riwayat log makanan. Data ini digunakan untuk memberikan rekomendasi gizi yang sesuai.
        </Section>

        <Section icon={<KeyIcon />} title="Keamanan Password">
          Password Anda dienkripsi menggunakan bcrypt sebelum disimpan ke database. Kami sendiri tidak dapat melihat password Anda dalam bentuk asli. Gunakan password minimal 8 karakter dan jangan dibagikan kepada siapapun.
        </Section>

        <Section icon={<ShieldIcon />} title="Berbagi Data dengan Pihak Ketiga">
          Kami <span className="font-bold">tidak menjual atau membagikan data pribadi</span> Anda kepada pihak ketiga manapun. Data digunakan eksklusif untuk fungsi aplikasi NutriSi.
        </Section>

        <Section icon={<ShieldIcon />} title="Cookies & Penyimpanan Lokal">
          Aplikasi menggunakan localStorage browser untuk menyimpan token sesi dan preferensi (foto profil, bahasa). Data ini hanya tersimpan di perangkat Anda dan dapat dihapus kapan saja melalui tombol Keluar atau Hapus Akun.
        </Section>

        {/* Hapus akun */}
        <div className="bg-white rounded-[18px] px-5 py-4 shadow-sm border border-red-100 mb-3">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-red-500"><TrashIcon /></span>
            <h3 className="text-red-600 font-bold text-[14px]">Hapus Akun</h3>
          </div>
          <p className="text-gray-600 text-[12px] leading-relaxed mb-3">
            Tindakan ini akan menghapus seluruh data lokal di perangkat ini termasuk sesi login dan foto profil. Anda akan keluar dari aplikasi.
          </p>
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-[13px]
                         py-2.5 rounded-full transition-colors">
              Hapus Data Lokal
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[13px]
                           py-2.5 rounded-full transition-colors">
                Batal
              </button>
              <button onClick={handleDeleteAccount}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold text-[13px]
                           py-2.5 rounded-full transition-colors">
                Ya, Hapus
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-gray-400 text-[11px] mt-4">
          Versi kebijakan terakhir: Juni 2026
        </p>
      </div>
    </div>
  );
}