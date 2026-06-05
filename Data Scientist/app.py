import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import MinMaxScaler
import re

# ── Page Config ──────────────────────────────────────────────
st.set_page_config(
    page_title="Smart Nutrition Tracker",
    page_icon="🥗",
    layout="wide"
)

# ── Load Data ─────────────────────────────────────────────────
@st.cache_data
def load_data():
    df_pangan = pd.read_csv('final_dataset.csv')
    df_akg = pd.read_csv('akg_anak.csv')
    return df_pangan, df_akg

df_pangan, df_akg = load_data()

# ── Sidebar ───────────────────────────────────────────────────
st.sidebar.title("🥗 Smart Nutrition Tracker")
st.sidebar.markdown("**Golden Age Children (0-6 Tahun)**")
st.sidebar.markdown("---")

menu = st.sidebar.radio("Navigasi", [
    "🏠 Beranda",
    "📊 Analisis Nutrisi",
    "🔍 Cari Makanan",
    "📋 Perbandingan AKG",
    "🏆 Rekomendasi Menu",
    "🧪 A/B Testing Metode Scoring"
])

st.sidebar.markdown("---")
st.sidebar.markdown("**CC26-PSU388**")
st.sidebar.markdown("Coding Camp 2026 × DBS Foundation")

# ══════════════════════════════════════════════════════════════
# PAGE 1 — BERANDA
# ══════════════════════════════════════════════════════════════
if menu == "🏠 Beranda":
    st.title("🥗 Smart Nutrition Tracker for Golden Age Children")
    st.markdown("##### Sistem Analisis Gizi Anak Usia 0-6 Tahun Berbasis Data TKPI 2017")
    st.markdown("---")

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Bahan Makanan", f"{len(df_pangan):,}")
    with col2:
        st.metric("Kelompok Makanan", df_pangan['kategori'].nunique())
    with col3:
        st.metric("Kolom Nutrisi", "21")
    with col4:
        st.metric("Kelompok Umur AKG", len(df_akg))

    st.markdown("---")
    st.subheader("📌 Tentang Proyek")
    st.markdown("""
    Proyek ini merupakan bagian dari **Smart Nutrition Tracker for Golden Age Children** 
    yang dikembangkan oleh Tim CC26-PSU388 dalam Coding Camp 2026 powered by DBS Foundation.
    
    Dashboard ini menampilkan hasil analisis data komposisi pangan Indonesia berdasarkan 
    **Tabel Komposisi Pangan Indonesia (TKPI) 2017** dari Kementerian Kesehatan RI, 
    dikombinasikan dengan **Angka Kecukupan Gizi (AKG) 2019** untuk anak usia 0-6 tahun.
    """)

    st.subheader("❓ Business Questions")
    bqs = [
        "Apa 10 bahan makanan Indonesia dengan kandungan energi tertinggi per 100 gram?",
        "Kelompok makanan mana yang memiliki rata-rata kandungan protein tertinggi?",
        "Bahan makanan lokal apa yang paling memenuhi kebutuhan AKG anak usia 0-6 tahun?",
        "Nutrisi apa yang paling banyak tidak terpenuhi dibandingkan AKG anak?",
        "Apa rekomendasi 5 bahan makanan lokal terbaik untuk gizi anak usia 0-6 tahun?"
    ]
    for i, bq in enumerate(bqs, 1):
        st.markdown(f"**BQ {i}:** {bq}")

    st.markdown("---")
    st.subheader("📖 Data Dictionary")
    data_dict = {
        'Kolom': ['kode','nama','kategori','tipe','air_g','energi_kal','protein_g','lemak_g','karbo_g','serat_g','abu_g','kalsium_mg','fosfor_mg','besi_mg','natrium_mg','kalium_mg','tembaga_mg','seng_mg','retinol_mcg','b_kar_mcg','kar_total_mcg','thiamin_mg','riboflavin_mg','niasin_mg','vit_c_mg','status_energi','status_protein','status_kalsium','status_besi','skor_gizi_anak'],
        'Tipe Data': ['object','object','object','object','float64','float64','float64','float64','float64','float64','float64','float64','float64','float64','float64','float64','float64','float64','float64','float64','float64','float64','float64','float64','float64','object','object','object','object','float64'],
        'Satuan': ['-','-','-','-','gram','Kalori','gram','gram','gram','gram','gram','miligram','miligram','miligram','miligram','miligram','miligram','miligram','mikrogram','mikrogram','mikrogram','miligram','miligram','miligram','miligram','-','-','-','-','0-1'],
        'Deskripsi': [
            'Kode unik bahan makanan berdasarkan TKPI',
            'Nama bahan makanan dalam Bahasa Indonesia',
            'Kelompok/kategori bahan makanan',
            'Tipe bahan makanan (mentah/olahan)',
            'Kandungan air per 100 gram',
            'Kandungan energi per 100 gram',
            'Kandungan protein per 100 gram',
            'Kandungan lemak per 100 gram',
            'Kandungan karbohidrat per 100 gram',
            'Kandungan serat pangan per 100 gram',
            'Kandungan abu per 100 gram',
            'Kandungan kalsium per 100 gram',
            'Kandungan fosfor per 100 gram',
            'Kandungan zat besi per 100 gram',
            'Kandungan natrium per 100 gram',
            'Kandungan kalium per 100 gram',
            'Kandungan tembaga per 100 gram',
            'Kandungan seng per 100 gram',
            'Kandungan retinol (Vitamin A) per 100 gram',
            'Kandungan beta-karoten per 100 gram',
            'Kandungan karoten total per 100 gram',
            'Kandungan thiamin (Vitamin B1) per 100 gram',
            'Kandungan riboflavin (Vitamin B2) per 100 gram',
            'Kandungan niasin per 100 gram',
            'Kandungan vitamin C per 100 gram',
            'Status kecukupan energi vs AKG rata-rata anak (Kurang/Cukup/Lebih)',
            'Status kecukupan protein vs AKG rata-rata anak (Kurang/Cukup/Lebih)',
            'Status kecukupan kalsium vs AKG rata-rata anak (Kurang/Cukup/Lebih)',
            'Status kecukupan zat besi vs AKG rata-rata anak (Kurang/Cukup/Lebih)',
            'Skor gabungan normalisasi energi, protein, kalsium, dan zat besi (0=terendah, 1=tertinggi)'
        ]
    }
    df_dict = pd.DataFrame(data_dict)
    df_dict.index += 1
    st.dataframe(df_dict, use_container_width=True)

# ══════════════════════════════════════════════════════════════
# PAGE 2 — ANALISIS NUTRISI
# ══════════════════════════════════════════════════════════════
elif menu == "📊 Analisis Nutrisi":
    st.title("📊 Analisis Nutrisi")
    st.markdown("---")

    tab1, tab2 = st.tabs(["BQ 1 — Top Energi", "BQ 2 — Protein per Kelompok"])

    with tab1:
        st.subheader("BQ 1: 10 Bahan Makanan dengan Energi Tertinggi per 100 gram")
        top_n = st.slider("Tampilkan top:", 5, 20, 10)
        top_energi = df_pangan.nlargest(top_n, 'energi_kal')[['nama', 'kategori', 'energi_kal']]

        fig, ax = plt.subplots(figsize=(10, 6))
        sns.barplot(data=top_energi, x='energi_kal', y='nama', hue='nama', palette='Oranges_r', legend=False, ax=ax)
        ax.set_title(f'Top {top_n} Bahan Makanan dengan Energi Tertinggi per 100 gram')
        ax.set_xlabel('Energi (Kal)')
        ax.set_ylabel('Nama Bahan Makanan')
        plt.tight_layout()
        st.pyplot(fig)

        st.markdown("""
        **Insight:** 10 bahan makanan dengan kandungan energi tertinggi didominasi kelompok 
        Minyak/Lemak dengan nilai 818-902 Kal per 100 gram. Meskipun tinggi energi, 
        kelompok ini tidak direkomendasikan sebagai sumber energi utama anak karena minim nutrisi esensial lainnya.
        """)
        top_energi = top_energi.reset_index(drop=True)
        top_energi.index += 1
        st.dataframe(top_energi)

    with tab2:
        st.subheader("BQ 2: Rata-rata Protein per Kelompok Makanan")
        avg_protein = df_pangan.groupby('kategori')['protein_g'].mean().sort_values(ascending=False).reset_index()

        fig2, ax2 = plt.subplots(figsize=(10, 6))
        sns.barplot(data=avg_protein, x='protein_g', y='kategori', hue='kategori', palette='Blues_r', legend=False, ax=ax2)
        ax2.set_title('Rata-rata Kandungan Protein per Kelompok Makanan')
        ax2.set_xlabel('Rata-rata Protein (g per 100 gram)')
        ax2.set_ylabel('Kelompok Makanan')
        plt.tight_layout()
        st.pyplot(fig2)

        st.markdown("""
        **Insight:** Kelompok Ikan/Kerang/Udang memiliki rata-rata protein tertinggi (21.73 g), 
        diikuti Daging (19.12 g) dan Kacang-Kacangan (16.22 g). Sumber protein hewani 
        secara umum lebih tinggi dibandingkan sumber nabati.
        """)
        
        avg_protein = avg_protein.reset_index(drop=True)
        avg_protein.index += 1
        st.dataframe(avg_protein)

# ══════════════════════════════════════════════════════════════
# PAGE 3 — CARI MAKANAN
# ══════════════════════════════════════════════════════════════
elif menu == "🔍 Cari Makanan":
    st.title("🔍 Cari Makanan & Kandungan Nutrisi")
    st.markdown("---")

    col1, col2 = st.columns([2, 1])
    with col1:
        search = st.text_input("Cari nama makanan:", placeholder="contoh: ayam, nasi, tempe...")
    with col2:
        kategori_filter = st.selectbox("Filter Kelompok:", ["Semua"] + sorted(df_pangan['kategori'].dropna().unique().tolist()))

    df_filtered = df_pangan.copy()
    if search:
        df_filtered = df_filtered[df_filtered['nama'].str.contains(search, case=False, na=False)]
    if kategori_filter != "Semua":
        df_filtered = df_filtered[df_filtered['kategori'] == kategori_filter]

    st.markdown(f"**Ditemukan {len(df_filtered)} bahan makanan**")

    cols_tampil = ['nama', 'kategori', 'tipe', 'energi_kal', 'protein_g', 'lemak_g', 'karbo_g', 'kalsium_mg', 'besi_mg', 'vit_c_mg']
    df_tampil = df_filtered[cols_tampil].reset_index(drop=True)
    df_tampil.index += 1
    st.dataframe(df_tampil, use_container_width=True)

    # Detail per makanan
    if len(df_filtered) > 0:
        st.markdown("---")
        st.subheader("📋 Detail Nutrisi")
        pilihan = st.selectbox("Pilih bahan makanan:", df_filtered['nama'].tolist())
        detail = df_filtered[df_filtered['nama'] == pilihan].iloc[0]

        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("Energi", f"{detail['energi_kal']:.0f} Kal")
        with col2:
            st.metric("Protein", f"{detail['protein_g']:.1f} g")
        with col3:
            st.metric("Lemak", f"{detail['lemak_g']:.1f} g")
        with col4:
            st.metric("Karbohidrat", f"{detail['karbo_g']:.1f} g")

        col5, col6, col7, col8 = st.columns(4)
        with col5:
            st.metric("Kalsium", f"{detail['kalsium_mg']:.0f} mg")
        with col6:
            st.metric("Zat Besi", f"{detail['besi_mg']:.1f} mg")
        with col7:
            st.metric("Vitamin C", f"{detail['vit_c_mg']:.0f} mg")
        with col8:
            st.metric("Serat", f"{detail['serat_g']:.1f} g")

# ══════════════════════════════════════════════════════════════
# PAGE 4 — PERBANDINGAN AKG
# ══════════════════════════════════════════════════════════════
elif menu == "📋 Perbandingan AKG":
    st.title("📋 Perbandingan Nutrisi dengan AKG Anak")
    st.markdown("---")

    tab1, tab2 = st.tabs(["BQ 3 — Pemenuhan AKG", "BQ 4 — Gap Nutrisi"])

    with tab1:
        st.subheader("BQ 3: Pemenuhan AKG Energi, Protein & Karbohidrat per 100 gram")

        umur_options = df_akg['kelompok_umur'].tolist()
        umur_pilih = st.selectbox("Pilih Kelompok Umur:", umur_options)
        akg_row = df_akg[df_akg['kelompok_umur'] == umur_pilih].iloc[0]

        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("AKG Energi", f"{akg_row['energi_kal']} Kal")
        with col2:
            st.metric("AKG Protein", f"{akg_row['protein_g']} g")
        with col3:
            st.metric("AKG Karbohidrat", f"{akg_row['karbohidrat_g']} g")

        df_pangan['pct_energi'] = (df_pangan['energi_kal'] / akg_row['energi_kal']) * 100
        df_pangan['pct_protein'] = (df_pangan['protein_g'] / akg_row['protein_g']) * 100
        df_pangan['pct_karbo'] = (df_pangan['karbo_g'] / akg_row['karbohidrat_g']) * 100
        df_pangan['skor_pemenuhan'] = (df_pangan['pct_energi'] + df_pangan['pct_protein'] + df_pangan['pct_karbo']) / 3

        top10 = df_pangan.nlargest(10, 'skor_pemenuhan')[['nama', 'kategori', 'skor_pemenuhan', 'pct_energi', 'pct_protein', 'pct_karbo']]

        fig, ax = plt.subplots(figsize=(10, 6))
        sns.barplot(data=top10, x='skor_pemenuhan', y='nama', hue='nama', palette='Greens_r', legend=False, ax=ax)
        ax.set_title(f'Top 10 Pemenuhan AKG per 100 gram\n(Kelompok Umur: {umur_pilih})')
        ax.set_xlabel('Rata-rata % Pemenuhan AKG')
        ax.set_ylabel('Nama Bahan Makanan')
        plt.tight_layout()
        st.pyplot(fig)

        st.markdown("""
        **Insight:** Kelompok Ikan/Kerang/Udang mendominasi pemenuhan AKG tertinggi 
        per 100 gram dengan Dendeng mujahir goreng sebagai yang terbaik (skor 153.67%). 
        Pemenuhan protein jauh melampaui AKG namun pemenuhan karbohidrat masih sangat 
        rendah sehingga perlu dikombinasikan dengan sumber karbohidrat seperti nasi, 
        umbi, atau serealia.
        """)
        top10 = top10.reset_index(drop=True)
        top10.index += 1
        st.dataframe(top10)

    with tab2:
        st.subheader("BQ 4: Persentase Nutrisi yang Tidak Terpenuhi vs AKG")

        umur_pilih2 = st.selectbox("Pilih Kelompok Umur:", umur_options, key='umur2')
        akg_row2 = df_akg[df_akg['kelompok_umur'] == umur_pilih2].iloc[0]

        nutrisi_map = {
            'energi_kal': 'energi_kal',
            'protein_g': 'protein_g',
            'lemak_g': 'lemak_g',
            'karbo_g': 'karbohidrat_g',
            'kalsium_mg': 'kalsium_mg',
            'besi_mg': 'besi_mg',
            'vit_c_mg': 'vit_c_mg'
        }

        pct_tidak = {}
        for col_p, col_a in nutrisi_map.items():
            if col_p in df_pangan.columns and col_a in akg_row2.index:
                threshold = akg_row2[col_a]
                tidak = (df_pangan[col_p] < threshold).sum()
                pct_tidak[col_p] = (tidak / len(df_pangan)) * 100

        df_gap = pd.DataFrame(list(pct_tidak.items()), columns=['nutrisi', 'pct_tidak_terpenuhi'])
        df_gap = df_gap.sort_values('pct_tidak_terpenuhi', ascending=False)

        fig2, ax2 = plt.subplots(figsize=(10, 6))
        sns.barplot(data=df_gap, x='pct_tidak_terpenuhi', y='nutrisi', hue='nutrisi', palette='Reds_r', legend=False, ax=ax2)
        ax2.set_title(f'% Bahan Makanan di Bawah Threshold AKG\n(Kelompok Umur: {umur_pilih2})')
        ax2.set_xlabel('% Bahan Makanan di Bawah Threshold AKG')
        ax2.set_ylabel('Nutrisi')
        plt.tight_layout()
        st.pyplot(fig2)

        st.markdown("""
        **Insight:** Energi dan karbohidrat menjadi nutrisi yang paling sulit terpenuhi 
        (100%), diikuti kalsium (97.38%), lemak (96.86%), vitamin C (94.68%), zat besi 
        (90.92%), dan protein (84.03%). Hal ini menegaskan pentingnya variasi dan 
        kombinasi menu harian anak golden age.
        """)
        df_gap = df_gap.reset_index(drop=True)
        df_gap.index += 1
        st.dataframe(df_gap)

# ══════════════════════════════════════════════════════════════
# PAGE 5 — REKOMENDASI MENU
# ══════════════════════════════════════════════════════════════
elif menu == "🏆 Rekomendasi Menu":
    st.title("🏆 Rekomendasi Menu Terbaik untuk Anak 0-6 Tahun")
    st.markdown("---")

    st.subheader("BQ 5: Bahan Makanan Lokal Terbaik Berdasarkan Kombinasi Nutrisi")

    col1, col2 = st.columns([1, 2])
    with col1:
        top_n = st.slider("Jumlah rekomendasi:", 3, 15, 5)
        nutrisi_pilih = st.multiselect(
            "Pilih nutrisi untuk scoring:",
            ['energi_kal', 'protein_g', 'kalsium_mg', 'besi_mg', 'vit_c_mg', 'serat_g'],
            default=['energi_kal', 'protein_g', 'kalsium_mg', 'besi_mg']
        )
        kategori_filter2 = st.selectbox("Filter Kelompok:", ["Semua"] + sorted(df_pangan['kategori'].dropna().unique().tolist()), key='kat2')

    with col2:
        if len(nutrisi_pilih) > 0:
            df_rek = df_pangan.copy()
            if kategori_filter2 != "Semua":
                df_rek = df_rek[df_rek['kategori'] == kategori_filter2]

            scaler = MinMaxScaler()
            df_rek[nutrisi_pilih] = scaler.fit_transform(df_rek[nutrisi_pilih])
            df_rek['skor_rekomendasi'] = df_rek[nutrisi_pilih].mean(axis=1)

            top_rek = df_rek.nlargest(top_n, 'skor_rekomendasi')
            top_rek_nama = df_pangan.loc[top_rek.index, 'nama']

            fig, ax = plt.subplots(figsize=(10, max(4, top_n * 0.6)))
            sns.barplot(x=top_rek['skor_rekomendasi'].values, y=top_rek_nama.values, hue=top_rek_nama.values, palette='viridis', legend=False, ax=ax)
            ax.set_title(f'Top {top_n} Rekomendasi Bahan Makanan')
            ax.set_xlabel('Skor Normalisasi (0-1)')
            ax.set_ylabel('Nama Bahan Makanan')
            plt.tight_layout()
            st.pyplot(fig)
        else:
            st.warning("Pilih minimal 1 nutrisi!")

    st.markdown("---")
    st.subheader("📊 Detail Nutrisi Rekomendasi")
    if len(nutrisi_pilih) > 0:
        cols_detail = ['nama', 'kategori'] + ['energi_kal', 'protein_g', 'kalsium_mg', 'besi_mg', 'vit_c_mg', 'serat_g']
        df_detail = df_pangan.loc[top_rek.index, cols_detail].reset_index(drop=True)
        df_detail.index += 1
        st.dataframe(df_detail, use_container_width=True)

    st.markdown("""
    **Insight:** Kombinasi bahan makanan dari kelompok Ikan/Kerang/Udang, Kacang-Kacangan, 
    dan Susu dapat menjadi dasar penyusunan menu harian anak yang kaya protein, kalsium, 
    dan zat besi untuk mendukung tumbuh kembang optimal pada periode golden age.
    """)

# ══════════════════════════════════════════════════════════════
# PAGE 6 — A/B TESTING
# ══════════════════════════════════════════════════════════════
elif menu == "🧪 A/B Testing Metode Scoring":
    st.title("🧪 A/B Testing: Perbandingan Metode Scoring")
    st.markdown("---")
    st.markdown("""
    Halaman ini membandingkan dua pendekatan scoring dalam menghasilkan 
    rekomendasi bahan makanan terbaik untuk anak usia 0-6 tahun.
    
    - **Metode A (Equal Weight):** Semua nutrisi diberi bobot sama (25% masing-masing)
    - **Metode B (AKG-Weighted):** Energi dan kalsium diberi bobot lebih tinggi (35%) 
      karena keduanya paling banyak tidak terpenuhi berdasarkan analisis BQ 4
    """)

    cols_ab = ['energi_kal', 'protein_g', 'kalsium_mg', 'besi_mg']
    scaler_ab = MinMaxScaler()
    df_ab = df_pangan.copy()
    df_ab[cols_ab] = scaler_ab.fit_transform(df_pangan[cols_ab])

    df_ab['skor_A'] = df_ab[cols_ab].mean(axis=1)

    bobot_B = {'energi_kal': 0.35, 'protein_g': 0.15, 'kalsium_mg': 0.35, 'besi_mg': 0.15}
    df_ab['skor_B'] = sum(df_ab[col] * w for col, w in bobot_B.items())

    top_n_ab = st.slider("Jumlah rekomendasi:", 3, 10, 5)

    top_A = df_pangan.loc[df_ab.nlargest(top_n_ab, 'skor_A').index, 'nama'].values
    top_B = df_pangan.loc[df_ab.nlargest(top_n_ab, 'skor_B').index, 'nama'].values

    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Metode A — Equal Weight")
        for i, nama in enumerate(top_A, 1):
            st.markdown(f"**{i}.** {nama}")

    with col2:
        st.subheader("Metode B — AKG-Weighted")
        for i, nama in enumerate(top_B, 1):
            st.markdown(f"**{i}.** {nama}")

    overlap = set(top_A) & set(top_B)
    st.markdown("---")
    st.metric("Bahan Makanan Overlap (muncul di kedua metode)", len(overlap))
    if overlap:
        st.success(f"Overlap: {', '.join(overlap)}")

    st.markdown("""
    **Insight:** Bahan makanan yang muncul di kedua metode merupakan pilihan paling 
    robust karena unggul secara konsisten di semua kombinasi bobot nutrisi. 
    Sistem Smart Nutrition Tracker menggunakan **Metode B** sebagai default karena 
    lebih merepresentasikan kondisi nyata kekurangan gizi anak Indonesia.
    """)