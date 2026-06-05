import json
import os
import numpy as np
import pandas as pd
import tensorflow as tf
import google.generativeai as genai
from dotenv import load_dotenv
from tensorflow import keras
from tensorflow.keras import layers

load_dotenv()


# ---------------------------------------------------------------------------
# Custom Layer
# ---------------------------------------------------------------------------

class NutritionAttentionLayer(layers.Layer):

    def __init__(self, hidden_units=64, dropout_rate=0.1, **kwargs):
        super().__init__(**kwargs)
        self.hidden_units = hidden_units
        self.dropout_rate = dropout_rate

    def build(self, input_shape):
        n = input_shape[-1]
        self.W1 = self.add_weight(name='W1', shape=(n, self.hidden_units),
                                  initializer='glorot_uniform', trainable=True)
        self.b1 = self.add_weight(name='b1', shape=(self.hidden_units,),
                                  initializer='zeros', trainable=True)
        self.W2 = self.add_weight(name='W2', shape=(self.hidden_units, n),
                                  initializer='glorot_uniform', trainable=True)
        self.layer_norm = layers.LayerNormalization()
        self.dropout    = layers.Dropout(self.dropout_rate)
        super().build(input_shape)

    def call(self, inputs, training=False):
        h       = tf.nn.tanh(tf.matmul(inputs, self.W1) + self.b1)
        weights = tf.nn.sigmoid(tf.matmul(h, self.W2))
        weights = self.dropout(weights, training=training)
        out     = self.layer_norm(inputs + inputs * weights)
        return out, weights

    def get_config(self):
        cfg = super().get_config()
        cfg.update({'hidden_units': self.hidden_units, 'dropout_rate': self.dropout_rate})
        return cfg


# ---------------------------------------------------------------------------
# Custom Loss
# ---------------------------------------------------------------------------

class FocalLoss(keras.losses.Loss):

    def __init__(self, gamma=1.5, alpha=None, name='focal_loss', **kwargs):
        super().__init__(name=name, **kwargs)
        self.gamma = gamma
        self.alpha = alpha

    def call(self, y_true, y_pred):
        y_pred       = tf.clip_by_value(y_pred, 1e-7, 1.0 - 1e-7)
        ce_loss      = -y_true * tf.math.log(y_pred)
        p_t          = tf.reduce_sum(y_true * y_pred, axis=-1, keepdims=True)
        focal_weight = tf.pow(1.0 - p_t, self.gamma)
        loss         = focal_weight * ce_loss

        if self.alpha is not None:
            alpha_t = tf.constant(self.alpha, dtype=tf.float32)
            loss    = loss * alpha_t

        return tf.reduce_mean(tf.reduce_sum(loss, axis=-1))

    def get_config(self):
        cfg = super().get_config()
        cfg.update({'gamma': self.gamma, 'alpha': self.alpha})
        return cfg


# ---------------------------------------------------------------------------
# Inference Engine
# ---------------------------------------------------------------------------

class NutritionInferenceEngine:

    def __init__(self, model_path: str, scaler_path: str):
        with open(scaler_path) as f:
            meta = json.load(f)

        self.model = keras.models.load_model(
            model_path,
            custom_objects={
                'NutritionAttentionLayer': NutritionAttentionLayer,
                'FocalLoss'              : FocalLoss
            }
        )
        self.mean       = np.array(meta['mean'],  dtype=np.float32)
        self.std        = np.array(meta['std'],   dtype=np.float32)
        self.features   = meta['features']
        self.feat_nutr  = meta['features_nutrisi']
        self.label_map  = {int(k): v for k, v in meta['label_map'].items()}
        self.status_map = meta['status_map']
        self.quartiles  = meta['quartiles']

    def _compute_status(self, data: dict, akg_ref: dict) -> dict:
        status = {}
        for key, akg_val in akg_ref.items():
            nilai = data.get(key, 0.0)
            if nilai < akg_val * 0.5:
                status[key] = 'Kurang'
            elif nilai <= akg_val:
                status[key] = 'Cukup'
            else:
                status[key] = 'Lebih'
        return status

    def _preprocess(self, data: dict, akg_ref: dict = None) -> np.ndarray:
        if akg_ref:
            status = self._compute_status(data, akg_ref)
        else:
            status = {
                'energi_kal': 'Kurang',
                'protein_g' : 'Kurang',
                'kalsium_mg': 'Kurang',
                'besi_mg'   : 'Kurang'
            }

        feat_vals = [data.get(f, 0.0) for f in self.feat_nutr]
        feat_vals += [
            self.status_map.get(status.get('energi_kal', 'Kurang'), 0),
            self.status_map.get(status.get('protein_g',  'Kurang'), 0),
            self.status_map.get(status.get('kalsium_mg', 'Kurang'), 0),
            self.status_map.get(status.get('besi_mg',    'Kurang'), 0),
        ]
        x = np.array(feat_vals, dtype=np.float32)
        return ((x - self.mean) / (self.std + 1e-8)).reshape(1, -1)

    def predict(self, data: dict, akg_ref: dict = None) -> dict:
        x_sc  = self._preprocess(data, akg_ref)
        probs = self.model.predict(x_sc, verbose=0)[0]
        kelas = int(np.argmax(probs))
        label = self.label_map[kelas]

        rekomendasi_map = {
            0: 'Tidak dianjurkan sebagai makanan utama anak usia dini.',
            1: 'Dapat digunakan, kombinasikan dengan sumber nutrisi lebih kaya.',
            2: 'Baik untuk menu harian anak. Variasikan dengan sumber nutrisi lain.',
            3: 'Sangat direkomendasikan untuk menu anak usia 0-6 tahun.'
        }

        return {
            'kelas'       : kelas,
            'label'       : label,
            'probabilitas': {self.label_map[i]: round(float(p), 4) for i, p in enumerate(probs)},
            'confidence'  : round(float(probs[kelas]), 4),
            'rekomendasi' : rekomendasi_map[kelas]
        }

    def predict_batch(self, df_input: pd.DataFrame, akg_ref: dict = None) -> pd.DataFrame:
        rows = []
        for _, row in df_input.iterrows():
            rows.append(self._preprocess(row.to_dict(), akg_ref)[0])
        X_sc  = np.array(rows, dtype=np.float32)
        probs = self.model.predict(X_sc, verbose=0)
        kelas = np.argmax(probs, axis=1)

        result = df_input.copy()
        result['pred_kelas']      = kelas
        result['pred_label']      = [self.label_map[k] for k in kelas]
        result['pred_confidence'] = probs.max(axis=1).round(4)
        return result


# ---------------------------------------------------------------------------
# Generative AI — Rekomendasi Menu via Claude API
# ---------------------------------------------------------------------------

def rekomendasikan_menu_llm(
    nama_makanan: str,
    hasil_prediksi: dict,
    usia_bulan: int = 12
) -> str:

    api_key = os.environ.get('GEMINI_API_KEY', '')

    if not api_key:
        return "GEMINI_API_KEY belum diset."

    label = hasil_prediksi['label']
    confidence = hasil_prediksi['confidence']

    prob_str = ', '.join([
        f"{k}: {v}"
        for k, v in hasil_prediksi['probabilitas'].items()
    ])

    prompt = f"""
Kamu adalah ahli gizi anak Indonesia yang berpengalaman.

Bahan makanan '{nama_makanan}' memiliki klasifikasi gizi {label} (confidence: {confidence:.2%}) berdasarkan analisis model machine learning untuk anak usia {usia_bulan} bulan.

Berikan rekomendasi menu praktis secara langsung dengan format berikut:

1. Contoh menu
2. Bahan pendamping
3. Cara penyajian sesuai usia
4. Catatan nutrisi singkat

Gunakan bahasa Indonesia yang profesional, padat, dan langsung ke poin. Jangan ada kalimat pembuka atau sapaan.
"""

    try:
        genai.configure(api_key=api_key)

        model = genai.GenerativeModel("gemini-3.5-flash")

        response = model.generate_content(prompt)

        return response.text

    except Exception:
        if label == "Rendah":
            return (
                f"{nama_makanan} sebaiknya dikombinasikan dengan "
                "sumber protein, sayur, dan buah agar kebutuhan "
                "nutrisi anak lebih seimbang."
            )

        elif label == "Cukup":
            return (
                f"{nama_makanan} cukup baik untuk menu anak. "
                "Tambahkan variasi sayur, buah, atau protein lain "
                "agar asupan lebih lengkap."
            )

        elif label == "Baik":
            return (
                f"{nama_makanan} baik digunakan dalam menu harian anak. "
                "Sajikan dengan karbohidrat dan sayur sesuai usia anak."
            )

        else:
            return (
                f"{nama_makanan} sangat baik untuk menu anak usia dini. "
                "Gunakan variasi penyajian agar anak tidak bosan."
            )
