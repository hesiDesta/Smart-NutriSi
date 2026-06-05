from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import uvicorn

from nutrition_inference import NutritionInferenceEngine, rekomendasikan_menu_llm


# ---------------------------------------------------------------------------
# Inisialisasi app dan model
# ---------------------------------------------------------------------------

app    = FastAPI(
    title       = "Smart Nutrition Tracker API",
    description = "REST API klasifikasi status gizi makanan untuk anak usia 0-6 tahun.",
    version     = "1.0.0"
)

engine = NutritionInferenceEngine(
    model_path  = "smart_nutrition_tracker.keras",
    scaler_path = "scaler_params.json"
)


# ---------------------------------------------------------------------------
# Schema request dan response
# ---------------------------------------------------------------------------

class NutrisiInput(BaseModel):
    energi_kal    : float
    protein_g     : float
    lemak_g       : float
    karbo_g       : float
    serat_g       : float
    kalsium_mg    : float
    fosfor_mg     : float
    besi_mg       : float
    natrium_mg    : float
    kalium_mg     : float
    seng_mg       : float
    retinol_mcg   : float
    thiamin_mg    : float
    riboflavin_mg : float
    niasin_mg     : float
    vit_c_mg      : float

    # AKG referensi opsional — jika tidak diisi, semua status default ke Kurang
    akg_ref: Optional[dict] = None

    class Config:
        json_schema_extra = {
            "example": {
                "energi_kal"    : 154,
                "protein_g"     : 12.4,
                "lemak_g"       : 10.8,
                "karbo_g"       : 0.7,
                "serat_g"       : 0.0,
                "kalsium_mg"    : 54,
                "fosfor_mg"     : 180,
                "besi_mg"       : 2.7,
                "natrium_mg"    : 122,
                "kalium_mg"     : 134,
                "seng_mg"       : 1.1,
                "retinol_mcg"   : 140,
                "thiamin_mg"    : 0.12,
                "riboflavin_mg" : 0.35,
                "niasin_mg"     : 0.1,
                "vit_c_mg"      : 0.0
            }
        }


class PrediksiResponse(BaseModel):
    kelas        : int
    label        : str
    probabilitas : dict
    confidence   : float
    rekomendasi  : str


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return {
        "nama"   : "Smart Nutrition Tracker API",
        "versi"  : "1.0.0",
        "status" : "aktif"
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/predict", response_model=PrediksiResponse)
def predict(payload: NutrisiInput):
    """
    Klasifikasi status gizi satu bahan makanan (per 100g).

    Mengembalikan kelas gizi (0-3), label (Rendah/Cukup/Baik/Sangat Baik),
    distribusi probabilitas, confidence, dan rekomendasi penggunaan.
    """
    try:
        data = payload.model_dump(exclude={"akg_ref"})
        hasil = engine.predict(data, akg_ref=payload.akg_ref)
        return hasil
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
class PrediksiDenganRekomendasiResponse(BaseModel):
    kelas             : int
    label             : str
    probabilitas      : dict
    confidence        : float
    rekomendasi       : str
    rekomendasi_menu  : str


@app.post("/predict-with-recommendation", response_model=PrediksiDenganRekomendasiResponse)
def predict_with_recommendation(
    payload       : NutrisiInput,
    nama_makanan  : str = "bahan makanan",
    usia_bulan    : int = 12
):
    """
    Klasifikasi gizi + rekomendasi menu dari AI.

    Mengembalikan semua output /predict ditambah rekomendasi menu
    yang di-generate oleh Gemini API berdasarkan hasil klasifikasi.
    """
    try:
        data   = payload.model_dump(exclude={"akg_ref"})
        hasil  = engine.predict(data, akg_ref=payload.akg_ref)
        menu   = rekomendasikan_menu_llm(nama_makanan, hasil, usia_bulan)
        return {**hasil, "rekomendasi_menu": menu}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# Jalankan server
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)