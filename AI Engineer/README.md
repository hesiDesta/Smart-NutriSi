
---
# Smart Nutrition Tracker API

REST API klasifikasi status gizi makanan untuk anak usia 0–6 tahun menggunakan Deep Learning (TensorFlow) dan FastAPI.

## Model Performance

- **Accuracy: 92.44%** pada test set (172 sampel)
- Kelas output: Rendah · Cukup · Baik · Sangat Baik

## Project Structure

```
SMART-NUTRITION-TRACKER/
├── main.py                          # FastAPI app & endpoints
├── inference.py                     # Inference engine & Gemini integration
├── smart_nutrition_tracker.keras    # Trained model
├── scaler_params.json               # Normalization parameters
├── requirements.txt
├── .env.example
├── .gitignore
├── logs/                            # TensorBoard training logs
│   └── smart_nutrition_v2/
│       ├── train/
│       └── val/
├── plot_01_eda.png
├── plot_02_training.png
├── plot_03_evaluasi.png
├── plot_04_attention.png
└── smart_nutrition_tracker_v2.ipynb
```

## Installation

```bash
pip install -r requirements.txt
```

Buat file `.env` dari template:

```bash
cp .env.example .env
```

Isi `.env`:

```
GEMINI_API_KEY=your_api_key_here
```

## Menjalankan API

```bash
python main.py
```

API berjalan di `http://localhost:8000`  
Swagger docs: `http://localhost:8000/docs`

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/` | Info API |
| GET | `/health` | Status server |
| POST | `/predict` | Klasifikasi status gizi |
| POST | `/predict-with-recommendation` | Klasifikasi + rekomendasi menu via Gemini |

### Contoh Request `/predict`

```json
{
  "energi_kal": 154,
  "protein_g": 12.4,
  "lemak_g": 10.8,
  "karbo_g": 0.7,
  "serat_g": 0.0,
  "kalsium_mg": 54,
  "fosfor_mg": 180,
  "besi_mg": 2.7,
  "natrium_mg": 122,
  "kalium_mg": 134,
  "seng_mg": 1.1,
  "retinol_mcg": 140,
  "thiamin_mg": 0.12,
  "riboflavin_mg": 0.35,
  "niasin_mg": 0.1,
  "vit_c_mg": 0.0
}
```

### Contoh Response `/predict`

```json
{
  "kelas": 1,
  "label": "Cukup",
  "probabilitas": {
    "Rendah": 0.0049,
    "Cukup": 0.8778,
    "Baik": 0.1167,
    "Sangat Baik": 0.0006
  },
  "confidence": 0.8778,
  "rekomendasi": "Dapat digunakan, kombinasikan dengan sumber nutrisi lebih kaya."
}
```

### Contoh Response `/predict-with-recommendation`

```json
{
  "kelas": 1,
  "label": "Cukup",
  "probabilitas": { "...": "..." },
  "confidence": 0.8778,
  "rekomendasi": "Dapat digunakan, kombinasikan dengan sumber nutrisi lebih kaya.",
  "rekomendasi_menu": "Menu Sarapan: Bubur ayam telur dengan sayuran..."
}
```

> Jika `GEMINI_API_KEY` tidak diset atau quota habis, endpoint tetap mengembalikan response dengan fallback recommendation — tidak crash.

## TensorBoard

```bash
python -m tensorboard.main --logdir logs
```

Buka `http://localhost:6006` untuk melihat grafik loss dan accuracy selama training.

## Deep Learning Components

| Komponen | Detail |
|----------|--------|
| Arsitektur | TensorFlow Functional API |
| Custom Layer | `NutritionAttentionLayer` — attention weight adaptif per fitur nutrisi |
| Custom Loss | `FocalLoss` — gamma=1.5, penalti lebih besar untuk hard examples |
| Custom Callback | `EarlyStoppingWithReport` — early stopping + laporan per-kelas tiap 10 epoch |
| Training Loop | `tf.GradientTape` dengan `tf.data.Dataset` |
| Generative AI | Gemini API untuk rekomendasi menu berdasarkan hasil klasifikasi model |

## Tech Stack

- TensorFlow 2.20
- FastAPI + Uvicorn
- Gemini API (`google-generativeai`)
- TensorBoard
- NumPy · Pandas · Scikit-learn