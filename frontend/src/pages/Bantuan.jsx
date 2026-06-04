import React, { useState } from 'react';

const ChevLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.6 6.32A7.85 7.85 0 0012.05 4a7.94 7.94 0 00-6.84 11.93L4 20l4.18-1.1a7.93 7.93 0 003.87 1h.01a7.95 7.95 0 005.55-13.58zM12.06 18.6h-.01a6.6 6.6 0 01-3.36-.92l-.24-.14-2.49.65.66-2.42-.16-.25a6.6 6.6 0 01-1-3.5 6.61 6.61 0 0111.27-4.68 6.55 6.55 0 011.94 4.69 6.61 6.61 0 01-6.61 6.57z"/>
  </svg>
);

const FAQ_ITEMS = [
  {
    q: 'Apa itu NutriSi?',
    a: 'NutriSi adalah aplikasi pemantau gizi anak usia emas (1-6 tahun) yang membantu orang tua mencatat asupan harian, melihat pencapaian Angka Kecukupan Gizi (AKG), dan mendapatkan rekomendasi menu sehat berbasis AI.',
  },
  {
    q: 'Bagaimana cara mencatat makanan?',
    a: 'Buka halaman Home, pilih hari yang diinginkan, lalu klik tombol "Log Makanan". Cari bahan makanan, pilih jenis makan (sarapan/cemilan/makan siang/makan malam), masukkan jumlah dalam gram, lalu simpan.',
  },
  {
    q: 'Dari mana data gizi makanan berasal?',
    a: 'Data nutrisi makanan diambil dari Tabel Komposisi Pangan Indonesia (TKPI) yang dikeluarkan oleh Kementerian Kesehatan RI. Setiap makanan memiliki info kalori, protein, kalsium, zat besi, dan lainnya per 100 gram.',
  },
  {
    q: 'Bagaimana AKG dihitung?',
    a: 'Angka Kecukupan Gizi mengikuti standar PMK Nomor 28 Tahun 2019. Kebutuhan dihitung berdasarkan usia anak: 1-3 tahun (1350 kkal, 20g protein) dan 4-6 tahun (1400 kkal, 25g protein). Target ini menjadi acuan persentase pencapaian harian.',
  },
  {
    q: 'Apa itu Streak?',
    a: 'Streak menunjukkan berapa hari berturut-turut Anda mencatat makanan anak hingga hari ini. Jika satu hari terlewat, streak akan kembali ke 0. Catat setiap hari untuk mempertahankan streak!',
  },
  {
    q: 'Bagaimana cara mengubah profil anak?',
    a: 'Masuk ke halaman Profile, lalu klik tombol "Edit Profile" di bawah foto profil. Anda dapat mengubah nama anak, tanggal lahir, tinggi dan berat badan, serta alergi dan kondisi khusus.',
  },
  {
    q: 'Apakah data saya aman?',
    a: 'Ya. Password dienkripsi dengan bcrypt, dan data hanya digunakan untuk fungsi aplikasi. Kami tidak membagikan data ke pihak ketiga. Detail lengkap dapat dilihat di menu Privasi & Keamanan.',
  },
  {
    q: 'Bagaimana cara reset password?',
    a: 'Saat ini fitur reset password sedang dalam pengembangan. Hubungi tim support melalui email atau WhatsApp di bawah jika Anda lupa password.',
  },
  {
    q: 'Apakah aplikasi ini gratis?',
    a: 'Ya, NutriSi sepenuhnya gratis untuk digunakan. Tidak ada biaya berlangganan atau pembelian dalam aplikasi.',
  },
];

function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={onToggle}
        className="w-full flex items-center justify-between py-3.5 px-1 text-left hover:bg-pink-50/30 transition-colors rounded-lg">
        <span className="text-gray-800 font-semibold text-[13px] pr-3 flex-1">{q}</span>
        <span className={`text-[#f2658f] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevDown />
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 px-1 anim-fade-up">
          <p className="text-gray-600 text-[12.5px] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function Bantuan({ onBack }) {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="font-['Poppins'] bg-pink-base min-h-screen pb-10">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <button onClick={onBack}
          className="flex items-center gap-1 text-gray-500 text-[13px] font-medium hover:text-[#f2658f] transition-colors">
          <ChevLeft /> Kembali
        </button>
        <h1 className="text-[#f2658f] font-bold text-[20px] tracking-tight">Bantuan & FAQ</h1>
        <div className="w-16" />
      </div>

      <div className="px-5">
        {/* Hero */}
        <div className="bg-white rounded-[18px] px-5 py-5 shadow-sm border border-gray-50 mb-4 text-center">
          <div className="text-[42px] mb-2">🤝</div>
          <h2 className="text-gray-800 font-bold text-[16px] mb-1">Butuh bantuan?</h2>
          <p className="text-gray-500 text-[12px] leading-relaxed">
            Temukan jawaban dari pertanyaan yang sering ditanyakan di bawah ini.
          </p>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-[18px] px-5 py-2 shadow-sm border border-gray-50 mb-4">
          <p className="text-gray-700 font-bold text-[14px] py-3 px-1 border-b border-gray-100">
            Pertanyaan yang Sering Diajukan
          </p>
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem
              key={i}
              q={item.q}
              a={item.a}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>

        {/* Contact */}
        <div className="bg-white rounded-[18px] px-5 py-4 shadow-sm border border-gray-50">
          <p className="text-gray-700 font-bold text-[14px] mb-3">Masih butuh bantuan?</p>
          <div className="flex flex-col gap-2">
            <a href="mailto:CC26-PSU388@student.devacademy.id"
              className="flex items-center gap-3 px-4 py-3 bg-[#fce4ec]/50 hover:bg-[#fce4ec] rounded-[12px] transition-colors">
              <span className="text-[#f2658f]"><MailIcon /></span>
              <div className="flex-1">
                <p className="text-gray-800 font-semibold text-[13px]">Email</p>
                <p className="text-gray-500 text-[11px]">CC26-PSU388@student.devacademy.id</p>
              </div>
            </a>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-[#E7F8E9] hover:bg-[#d4f0d7] rounded-[12px] transition-colors">
              <span className="text-[#25D366]"><WhatsAppIcon /></span>
              <div className="flex-1">
                <p className="text-gray-800 font-semibold text-[13px]">WhatsApp</p>
                <p className="text-gray-500 text-[11px]">+62 812-3456-7890</p>
              </div>
            </a>
          </div>
        </div>

        <p className="text-center text-gray-300 text-[11px] font-medium mt-5">
          NutriSi v1.0.0 · Tim akan merespon dalam 1×24 jam
        </p>
      </div>
    </div>
  );
}