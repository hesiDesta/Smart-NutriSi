\# 🥗 Smart Nutrition Tracker for Golden Age Children



Proyek ini merupakan bagian dari Coding Camp 2026 powered by DBS Foundation oleh Tim CC26-PSU388 dengan tema \*\*Healthy Lives \& Well-being\*\*.



Dashboard ini menyajikan hasil analisis data komposisi pangan Indonesia untuk mendukung pemantauan gizi anak usia 0–6 tahun (golden age) berbasis data TKPI 2017 dan AKG 2019.



\---



\## 🔗 Link Dashboard



👉 \[Smart Nutrition Tracker - Streamlit App](https://smart-nutrition-tracker-for-golden-age-children.streamlit.app/)



\---



\## 👥 Tim CC26-PSU388



| Nama | Role |

|---|---|

| Muhammad Fadli Rahmansyah | Full-Stack Web Developer |

| Hesi Desta Lestari | Full-Stack Web Developer |

| Khalisha Adzraini Arif | AI Engineer |

| Yuyun Nailufar | AI Engineer |

| Alfian Anggara Putra Afandy | Data Scientist |

| Regina Arija Zuhra | Data Scientist |



\---



\## 📁 Struktur File



| File | Keterangan |

|---|---|

| `01\_Gathering.ipynb` | Notebook pengumpulan data (web scraping \& AKG) |

| `02\_Analisis.ipynb` | Notebook analisis data (wrangling, EDA, visualisasi) |

| `app.py` | Streamlit dashboard |

| `panganku\_dataset.csv` | Dataset komposisi pangan (hasil scraping panganku.org) |

| `akg\_anak.csv` | Dataset AKG anak 0–6 tahun (Permenkes No. 28/2019) |

| `final\_dataset.csv` | Final dataset siap model (hasil cleaning + feature engineering) |

| `requirements.txt` | Library yang dibutuhkan |

| `README.md` | Dokumentasi proyek |



\---



\## 📊 Dataset



| Dataset | Sumber | Jumlah Data |

|---|---|---|

| Komposisi Pangan | panganku.org (TKPI 2017, Kemenkes RI) | 1.146 bahan makanan, 28 kolom |

| AKG Anak | Permenkes RI No. 28 Tahun 2019 | 4 kelompok umur (0–6 tahun) |



\---



\## ❓ Business Questions



1\. Apa 10 bahan makanan Indonesia dengan kandungan energi tertinggi per 100 gram?

2\. Kelompok makanan mana yang memiliki rata-rata kandungan protein tertinggi?

3\. Bahan makanan lokal apa yang paling memenuhi kebutuhan AKG anak usia 0–6 tahun?

4\. Nutrisi apa yang paling banyak tidak terpenuhi dibandingkan AKG anak?

5\. Apa rekomendasi 5 bahan makanan lokal terbaik untuk gizi anak usia 0–6 tahun?



\---



\## ⚙️ Setup \& Run



Install dependencies:



&#x20;   pip install -r requirements.txt



Jalankan dashboard:



&#x20;   streamlit run app.py



\---



\## 🛠️ Tech Stack



| Library | Kegunaan |

|---|---|

| Pandas, NumPy | Data processing |

| Matplotlib, Seaborn | Visualisasi data |

| Scikit-learn | Feature engineering |

| Streamlit | Dashboard interaktif |

| Requests, BeautifulSoup | Web scraping |

