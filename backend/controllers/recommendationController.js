const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { Logs } = require('../db/dbHelper');
const authController = require('./authController');
const foodController = require('./foodController');

const RULES_PATH = path.join(__dirname, '../ml/model_rules.json');
const PYTHON_PREDICT_PATH = path.join(__dirname, '../ml/predict.py');

// Robust JavaScript Fallback Prediction Engine (matches predict.py exactly)
function runJsPrediction(inputs) {
  const target_kkal = parseFloat(inputs.target_kkal || 1125);
  const target_protein = parseFloat(inputs.target_protein || 30);
  const target_kalsium = parseFloat(inputs.target_kalsium || 850);
  const target_zatBesi = parseFloat(inputs.target_zatBesi || 30);

  const log_kkal = parseFloat(inputs.kkal || 0);
  const log_protein = parseFloat(inputs.protein || 0);
  const log_kalsium = parseFloat(inputs.kalsium || 0);
  const log_zatBesi = parseFloat(inputs.zatBesi || 0);
  const log_vitC = parseFloat(inputs.vitC || 0);

  const pct_kkal = Math.min(Math.round((log_kkal / target_kkal) * 100), 100);
  const pct_protein = Math.min(Math.round((log_protein / target_protein) * 100), 100);
  const pct_kalsium = Math.min(Math.round((log_kalsium / target_kalsium) * 100), 100);
  const pct_zatBesi = Math.min(Math.round((log_zatBesi / target_zatBesi) * 100), 100);

  const overall_pct = Math.round((pct_kkal + pct_protein + pct_kalsium + pct_zatBesi) / 4);

  const deficiencies = [];
  
  // Evaluasi Protein
  if (log_protein < target_protein * 0.8) {
    const diff = Math.max(0, parseFloat((target_protein - log_protein).toFixed(1)));
    deficiencies.push({
      emoji: '🍗',
      label: 'Protein',
      pct: pct_protein,
      color: '#3B82F6',
      note: `Kurang ${diff} gram`
    });
  } else {
    deficiencies.push({
      emoji: '🍗',
      label: 'Protein',
      pct: pct_protein,
      color: '#22C55E',
      note: 'Cukup'
    });
  }

  // Evaluasi Zat Besi
  if (log_zatBesi < target_zatBesi * 0.8) {
    const diff = Math.max(0, parseFloat((target_zatBesi - log_zatBesi).toFixed(1)));
    deficiencies.push({
      emoji: '🌿',
      label: 'Zat Besi',
      pct: pct_zatBesi,
      color: '#F97316',
      note: `Kurang ${diff} mg`
    });
  } else {
    deficiencies.push({
      emoji: '🌿',
      label: 'Zat Besi',
      pct: pct_zatBesi,
      color: '#22C55E',
      note: 'Cukup'
    });
  }

  // Evaluasi Kalsium
  if (log_kalsium < target_kalsium * 0.8) {
    const diff = Math.max(0, parseFloat((target_kalsium - log_kalsium).toFixed(1)));
    deficiencies.push({
      emoji: '🦷',
      label: 'Kalsium',
      pct: pct_kalsium,
      color: '#8B5CF6',
      note: `Kurang ${diff} mg`
    });
  } else {
    deficiencies.push({
      emoji: '🦷',
      label: 'Kalsium',
      pct: pct_kalsium,
      color: '#22C55E',
      note: 'Cukup'
    });
  }

  deficiencies.sort((a, b) => a.pct - b.pct);

  const features_weight = { protein: 0.40, kalsium: 0.25, zatBesi: 0.20, kkal: 0.15 };
  const skor_gizi = parseFloat((
    (pct_protein / 100) * features_weight.protein +
    (pct_kalsium / 100) * features_weight.kalsium +
    (pct_zatBesi / 100) * features_weight.zatBesi +
    (pct_kkal / 100) * features_weight.kkal
  ).toFixed(4));

  let recommended_foods = null;

  if (fs.existsSync(RULES_PATH)) {
    try {
      const rules = JSON.parse(fs.readFileSync(RULES_PATH, 'utf8'));
      const category_recs = rules.category_recommendations || {};
      
      const matched_categories = [];
      if (log_protein < target_protein * 0.8) {
        matched_categories.push('Daging', 'Ikan/Kerang/Udang dll');
      }
      if (log_kalsium < target_kalsium * 0.8) {
        matched_categories.push('Kacang-Kacangan');
      }
      if (log_zatBesi < target_zatBesi * 0.8) {
        matched_categories.push('Sayuran', 'Kacang-Kacangan');
      }

      // Deduplicate and fallback
      const unique_cats = [...new Set(matched_categories)];
      const cats_to_use = unique_cats.length > 0 ? unique_cats : ['Buah', 'Sayuran', 'Kacang-Kacangan', 'Daging', 'Ikan/Kerang/Udang dll'];

      const recs_by_meal = {
        Sarapan: [],
        Cemilan: [],
        'Makan Siang': [],
        'Makan Malam': []
      };

      const meal_types = Object.keys(recs_by_meal);
      let counter = 0;

      cats_to_use.forEach(cat => {
        const cat_items = category_recs[cat] || [];
        cat_items.slice(0, 3).forEach(item => {
          const meal = meal_types[counter % meal_types.length];
          
          let why_desc = "Kaya akan nutrisi penting untuk tumbuh kembang anak.";
          if (item.protein > 15) {
            why_desc = `Sumber protein tinggi (${item.protein}g/100g) sangat optimal untuk menumbuhkan kekuatan otot dan sel anak.`;
          } else if (item.kalsium > 150) {
            why_desc = `Tinggi kalsium (${item.kalsium}mg/100g) membantu memperkokoh pertumbuhan struktur gigi dan tulang anak.`;
          } else if (item.zatBesi > 2.5) {
            why_desc = `Tinggi kandungan zat besi (${item.zatBesi}mg/100g) sangat baik dalam melancarkan oksigen ke otak anak dan mencegah anemia.`;
          }

          const bg_colors = ['#F89EBD', '#8DD68F', '#B5A2EC', '#FFD166'];
          const bg = bg_colors[counter % bg_colors.length];

          recs_by_meal[meal].append = recs_by_meal[meal].push({
            name: item.nama,
            kkal: Math.round(item.kkal),
            protein: item.protein,
            kalsium: item.kalsium,
            zatBesi: item.zatBesi,
            bg: bg,
            why: why_desc,
            tags: [cat, "Rekomendasi AI"]
          });
          counter++;
        });
      });

      recommended_foods = recs_by_meal;
    } catch (err) {
      console.error('Error reading rules in fallback JS:', err);
    }
  }

  if (!recommended_foods) {
    recommended_foods = {
      Sarapan: [
        { name: 'Telur Rebus + Roti Gandum', kkal: 280, protein: 18, bg: '#F89EBD', why: 'Kaya protein & zat besi — membantu pertumbuhan dan mencegah anemia.', tags: ['Protein', 'Zat Besi', 'Energi'] },
        { name: 'Susu + Pisang', kkal: 190, protein: 8, bg: '#8DD68F', why: 'Kalsium dari susu + kalium dari pisang — sempurna untuk tulang kuat.', tags: ['Kalsium', 'Kalium', 'Energi'] }
      ],
      Cemilan: [
        { name: 'Kacang Hijau Rebus', kkal: 130, protein: 9, bg: '#8DD68F', why: 'Zat besi tertinggi dari kacang-kacangan — sangat dibutuhkan anak.', tags: ['Zat Besi', 'Protein', 'Serat'] }
      ],
      'Makan Siang': [
        { name: 'Nasi + Sayur Bayam + Tempe', kkal: 350, protein: 22, bg: '#B5A2EC', why: 'Kombinasi zat besi dari bayam + protein nabati tempe yang optimal.', tags: ['Zat Besi', 'Protein', 'Kalsium'] }
      ],
      'Makan Malam': [
        { name: 'Nasi + Tahu + Brokoli', kkal: 300, protein: 16, bg: '#8DD68F', why: 'Kalsium dari tahu + vitamin C dari brokoli untuk imunitas malam.', tags: ['Kalsium', 'Vitamin C', 'Protein'] }
      ]
    };
  }

  return {
    overall_percentage: overall_pct,
    nutrition_score: skor_gizi,
    deficiencies,
    recommendations: recommended_foods,
    status: {
      energi: pct_kkal >= 80 ? 'Cukup' : 'Kurang',
      protein: pct_protein >= 80 ? 'Cukup' : 'Kurang',
      kalsium: pct_kalsium >= 80 ? 'Cukup' : 'Kurang',
      zatBesi: pct_zatBesi >= 80 ? 'Cukup' : 'Kurang'
    }
  };
}

const cleanNum = (val) => (val === undefined || val === null || isNaN(Number(val))) ? 0 : Number(val);

// Helper function to predict food recommendation using Railway API
async function predictFoodRecommendation(item, allFoods, usia_bulan, cat, meal, bg) {
  const foodDetail = allFoods.find(f => f.id === item.kode) || allFoods.find(f => f.name === (item.nama || item.name));
  
  const body = {
    besi_mg: cleanNum(foodDetail ? foodDetail.zatBesi : (item.zatBesi || item.besi_mg || 0)),
    energi_kal: cleanNum(foodDetail ? foodDetail.kkal : (item.kkal || item.energi_kal || 0)),
    fosfor_mg: cleanNum(foodDetail ? foodDetail.fosfor : (item.fosfor || item.fosfor_mg || 0)),
    kalium_mg: cleanNum(foodDetail ? foodDetail.kalium : (item.kalium || item.kalium_mg || 0)),
    kalsium_mg: cleanNum(foodDetail ? foodDetail.kalsium : (item.kalsium || item.kalsium_mg || 0)),
    karbo_g: cleanNum(foodDetail ? foodDetail.carbohydrate : (item.carbohydrate || item.karbo_g || 0)),
    lemak_g: cleanNum(foodDetail ? foodDetail.fat : (item.fat || item.lemak_g || 0)),
    natrium_mg: cleanNum(foodDetail ? foodDetail.natrium : (item.natrium || item.natrium_mg || 0)),
    niasin_mg: cleanNum(foodDetail ? foodDetail.niasin : (item.niasin || item.niasin_mg || 0)),
    protein_g: cleanNum(foodDetail ? foodDetail.protein : (item.protein || item.protein_g || 0)),
    retinol_mcg: cleanNum(foodDetail ? foodDetail.retinol : (item.retinol || item.retinol_mcg || 0)),
    riboflavin_mg: cleanNum(foodDetail ? foodDetail.riboflavin : (item.riboflavin || item.riboflavin_mg || 0)),
    seng_mg: cleanNum(foodDetail ? foodDetail.seng : (item.seng || item.seng_mg || 0)),
    serat_g: cleanNum(foodDetail ? foodDetail.fiber : (item.fiber || item.serat_g || 0)),
    thiamin_mg: cleanNum(foodDetail ? foodDetail.thiamin : (item.thiamin || item.thiamin_mg || 0)),
    vit_c_mg: cleanNum(foodDetail ? foodDetail.vitC : (item.vitC || item.vit_c_mg || 0))
  };

  try {
    const url = `https://smart-nutrition-tracker-production.up.railway.app/predict?nama_makanan=${encodeURIComponent(item.nama || item.name)}&usia_bulan=${usia_bulan}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      const data = await res.json();
      return {
        name: item.nama || item.name,
        kkal: Math.round(item.kkal || (foodDetail ? foodDetail.kkal : 0)),
        protein: item.protein || (foodDetail ? foodDetail.protein : 0),
        kalsium: item.kalsium || (foodDetail ? foodDetail.kalsium : 0),
        zatBesi: item.zatBesi || (foodDetail ? foodDetail.zatBesi : 0),
        vitC: item.vitC || (foodDetail ? foodDetail.vitC : 0),
        
        // Include other nutrient fields for combination menu summing
        fat: foodDetail ? foodDetail.fat : 0,
        carbohydrate: foodDetail ? foodDetail.carbohydrate : 0,
        fiber: foodDetail ? foodDetail.fiber : 0,
        fosfor: foodDetail ? foodDetail.fosfor : 0,
        kalium: foodDetail ? foodDetail.kalium : 0,
        natrium: foodDetail ? foodDetail.natrium : 0,
        niasin: foodDetail ? foodDetail.niasin : 0,
        retinol: foodDetail ? foodDetail.retinol : 0,
        riboflavin: foodDetail ? foodDetail.riboflavin : 0,
        seng: foodDetail ? foodDetail.seng : 0,
        thiamin: foodDetail ? foodDetail.thiamin : 0,
        
        bg: bg,
        why: data.rekomendasi || `Kaya akan nutrisi penting untuk tumbuh kembang anak.`,
        rekomendasi_menu: data.rekomendasi_menu || '',
        tags: [cat, `AI: ${data.label || 'Cukup'}`],
        aiLabel: data.label,
        aiConfidence: data.confidence,
        aiProbabilities: data.probabilitas
      };
    }
  } catch (err) {
    console.error('Failed to predict for food:', item.nama || item.name, err.message);
  }

  // Fallback if API fails
  let why_desc = item.why || "Kaya akan nutrisi penting untuk tumbuh kembang anak.";
  if (item.protein > 15) {
    why_desc = `Sumber protein tinggi (${item.protein}g/100g) sangat optimal untuk menumbuhkan kekuatan otot dan sel anak.`;
  } else if (item.kalsium > 150) {
    why_desc = `Tinggi kalsium (${item.kalsium}mg/100g) membantu memperkokoh pertumbuhan struktur gigi dan tulang anak.`;
  } else if (item.zatBesi > 2.5) {
    why_desc = `Tinggi kandungan zat besi (${item.zatBesi}mg/100g) sangat baik dalam melancarkan oksigen ke otak anak dan mencegah anemia.`;
  }

  return {
    name: item.nama || item.name,
    kkal: Math.round(item.kkal || 0),
    protein: item.protein || 0,
    kalsium: item.kalsium || 0,
    zatBesi: item.zatBesi || 0,
    vitC: item.vitC || 0,
    
    // Include fallback empty nutrient fields
    fat: foodDetail ? foodDetail.fat : 0,
    carbohydrate: foodDetail ? foodDetail.carbohydrate : 0,
    fiber: foodDetail ? foodDetail.fiber : 0,
    fosfor: foodDetail ? foodDetail.fosfor : 0,
    kalium: foodDetail ? foodDetail.kalium : 0,
    natrium: foodDetail ? foodDetail.natrium : 0,
    niasin: foodDetail ? foodDetail.niasin : 0,
    retinol: foodDetail ? foodDetail.retinol : 0,
    riboflavin: foodDetail ? foodDetail.riboflavin : 0,
    seng: foodDetail ? foodDetail.seng : 0,
    thiamin: foodDetail ? foodDetail.thiamin : 0,
    
    bg: bg,
    why: why_desc,
    rekomendasi_menu: '',
    tags: [cat, "Rekomendasi AI"],
    aiLabel: 'Cukup'
  };
}

exports.getRecommendations = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const rawLogs = await Logs.getByUserAndDate(req.user.id, date);
    
    // Scale logged foods
    const factorNutrition = (food, gram) => {
      const f = gram / 100;
      return {
        kkal: food.kkal * f,
        protein: food.protein * f,
        kalsium: food.kalsium * f,
        zatBesi: food.zatBesi * f,
        vitC: food.vitC * f
      };
    };

    const totals = rawLogs.reduce((acc, log) => {
      const n = factorNutrition(log.food, log.gram);
      return {
        kkal: acc.kkal + n.kkal,
        protein: acc.protein + n.protein,
        kalsium: acc.kalsium + n.kalsium,
        zatBesi: acc.zatBesi + n.zatBesi,
        vitC: acc.vitC + n.vitC
      };
    }, { kkal: 0, protein: 0, kalsium: 0, zatBesi: 0, vitC: 0 });

    const target = authController.calculateAKG(req.user.childProfile) || {
      kkal: 1125,
      protein: 30,
      kalsium: 850,
      zatBesi: 30,
      vitC: 45
    };

    const pct_kkal = Math.min(Math.round((totals.kkal / target.kkal) * 100), 100);
    const pct_protein = Math.min(Math.round((totals.protein / target.protein) * 100), 100);
    const pct_kalsium = Math.min(Math.round((totals.kalsium / target.kalsium) * 100), 100);
    const pct_zatBesi = Math.min(Math.round((totals.zatBesi / target.zatBesi) * 100), 100);
    const overall_pct = Math.round((pct_kkal + pct_protein + pct_kalsium + pct_zatBesi) / 4);

    const deficiencies = [];
    
    // Evaluate deficiencies
    if (totals.protein < target.protein * 0.8) {
      const diff = Math.max(0, parseFloat((target.protein - totals.protein).toFixed(1)));
      deficiencies.push({ emoji: '🍗', label: 'Protein', pct: pct_protein, color: '#3B82F6', note: `Kurang ${diff} gram` });
    } else {
      deficiencies.push({ emoji: '🍗', label: 'Protein', pct: pct_protein, color: '#22C55E', note: 'Cukup' });
    }

    if (totals.zatBesi < target.zatBesi * 0.8) {
      const diff = Math.max(0, parseFloat((target.zatBesi - totals.zatBesi).toFixed(1)));
      deficiencies.push({ emoji: '🌿', label: 'Zat Besi', pct: pct_zatBesi, color: '#F97316', note: `Kurang ${diff} mg` });
    } else {
      deficiencies.push({ emoji: '🌿', label: 'Zat Besi', pct: pct_zatBesi, color: '#22C55E', note: 'Cukup' });
    }

    if (totals.kalsium < target.kalsium * 0.8) {
      const diff = Math.max(0, parseFloat((target.kalsium - totals.kalsium).toFixed(1)));
      deficiencies.push({ emoji: '🦷', label: 'Kalsium', pct: pct_kalsium, color: '#8B5CF6', note: `Kurang ${diff} mg` });
    } else {
      deficiencies.push({ emoji: '🦷', label: 'Kalsium', pct: pct_kalsium, color: '#22C55E', note: 'Cukup' });
    }

    // Sort deficiencies
    deficiencies.sort((a, b) => a.pct - b.pct);

    // Calculate age in months
    let usia_bulan = 12;
    if (req.user && req.user.childProfile && req.user.childProfile.tanggalLahir) {
      const birthDate = new Date(req.user.childProfile.tanggalLahir);
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        let diff = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
        if (today.getDate() < birthDate.getDate()) {
          diff--;
        }
        usia_bulan = Math.max(0, diff);
      }
    }

    const allFoods = foodController.getFoodsArray();
    let candidates = [];

    if (fs.existsSync(RULES_PATH)) {
      try {
        const rules = JSON.parse(fs.readFileSync(RULES_PATH, 'utf8'));
        const category_recs = rules.category_recommendations || {};
        
        const matched_categories = [];
        if (totals.protein < target.protein * 0.8) {
          matched_categories.push('Daging', 'Ikan/Kerang/Udang dll');
        }
        if (totals.kalsium < target.kalsium * 0.8) {
          matched_categories.push('Kacang-Kacangan');
        }
        if (totals.zatBesi < target.zatBesi * 0.8) {
          matched_categories.push('Sayuran', 'Kacang-Kacangan');
        }

        const unique_cats = [...new Set(matched_categories)];
        const cats_to_use = unique_cats.length > 0 ? unique_cats : ['Buah', 'Sayuran', 'Kacang-Kacangan', 'Daging', 'Ikan/Kerang/Udang dll'];

        const meal_types = ['Sarapan', 'Cemilan', 'Makan Siang', 'Makan Malam'];
        let counter = 0;

        cats_to_use.forEach(cat => {
          const cat_items = category_recs[cat] || [];
          cat_items.slice(0, 3).forEach(item => {
            const meal = meal_types[counter % meal_types.length];
            const bg_colors = ['#F89EBD', '#8DD68F', '#B5A2EC', '#FFD166'];
            const bg = bg_colors[counter % bg_colors.length];
            candidates.push({ item, cat, meal, bg });
            counter++;
          });
        });
      } catch (err) {
        console.error('Error reading rules in controller:', err);
      }
    }

    if (candidates.length === 0) {
      // Fallback defaults
      const defaultRecs = [
        { item: { name: 'Telur Ayam Rebus', kkal: 154, protein: 12.4, kalsium: 54, zatBesi: 2.7, vitC: 0 }, cat: 'Telur', meal: 'Sarapan', bg: '#F89EBD' },
        { item: { name: 'Susu Sapi Segar', kkal: 200, protein: 14.0, kalsium: 400, zatBesi: 0.1, vitC: 2 }, cat: 'Susu', meal: 'Sarapan', bg: '#8DD68F' },
        { item: { name: 'Pisang Segar', kkal: 74, protein: 5.0, kalsium: 10, zatBesi: 0.5, vitC: 10 }, cat: 'Buah', meal: 'Cemilan', bg: '#8DD68F' },
        { item: { name: 'Nasi + Sayur Bayam', kkal: 203, protein: 5.9, kalsium: 120, zatBesi: 3.5, vitC: 20 }, cat: 'Sayur', meal: 'Makan Siang', bg: '#B5A2EC' },
        { item: { name: 'Tahu Kukus Brokoli', kkal: 180, protein: 12.0, kalsium: 250, zatBesi: 2.1, vitC: 30 }, cat: 'Tahu', meal: 'Makan Malam', bg: '#FFD166' }
      ];
      candidates = defaultRecs;
    }

    // Call Railway API for predictions in parallel
    const recommended_foods = {
      Sarapan: [],
      Cemilan: [],
      'Makan Siang': [],
      'Makan Malam': []
    };

    const predictedResults = await Promise.all(
      candidates.map(c => predictFoodRecommendation(c.item, allFoods, usia_bulan, c.cat, c.meal, c.bg))
    );

    predictedResults.forEach((res, idx) => {
      const meal = candidates[idx].meal;
      recommended_foods[meal].push(res);
    });

    res.json({
      engine: 'Railway AI Classifier',
      data: {
        overall_percentage: overall_pct,
        deficiencies,
        recommendations: recommended_foods
      }
    });

  } catch (err) {
    console.error('Recommendation API error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses rekomendasi gizi anak.' });
  }
};

exports.generateMenuFromIngredients = async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Bahan makanan terpilih tidak boleh kosong.' });
    }

    // Calculate age in months
    let usia_bulan = 12;
    if (req.user && req.user.childProfile && req.user.childProfile.tanggalLahir) {
      const birthDate = new Date(req.user.childProfile.tanggalLahir);
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        let diff = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
        if (today.getDate() < birthDate.getDate()) {
          diff--;
        }
        usia_bulan = Math.max(0, diff);
      }
    }

    // Calculate combined nutrients
    const combined = {
      besi_mg: 0,
      energi_kal: 0,
      fosfor_mg: 0,
      kalium_mg: 0,
      kalsium_mg: 0,
      karbo_g: 0,
      lemak_g: 0,
      natrium_mg: 0,
      niasin_mg: 0,
      protein_g: 0,
      retinol_mcg: 0,
      riboflavin_mg: 0,
      seng_mg: 0,
      serat_g: 0,
      thiamin_mg: 0,
      vit_c_mg: 0
    };

    ingredients.forEach(item => {
      combined.besi_mg += cleanNum(item.zatBesi || item.besi_mg || 0);
      combined.energi_kal += cleanNum(item.kkal || item.energi_kal || 0);
      combined.kalsium_mg += cleanNum(item.kalsium || item.kalsium_mg || 0);
      combined.protein_g += cleanNum(item.protein || item.protein_g || 0);
      combined.vit_c_mg += cleanNum(item.vitC || item.vit_c_mg || 0);
      
      combined.fosfor_mg += cleanNum(item.fosfor || item.fosfor_mg || 0);
      combined.kalium_mg += cleanNum(item.kalium || item.kalium_mg || 0);
      combined.karbo_g += cleanNum(item.carbohydrate || item.karbo_g || 0);
      combined.lemak_g += cleanNum(item.fat || item.lemak_g || 0);
      combined.natrium_mg += cleanNum(item.natrium || item.natrium_mg || 0);
      combined.niasin_mg += cleanNum(item.niasin || item.niasin_mg || 0);
      combined.retinol_mcg += cleanNum(item.retinol || item.retinol_mcg || 0);
      combined.riboflavin_mg += cleanNum(item.riboflavin || item.riboflavin_mg || 0);
      combined.seng_mg += cleanNum(item.seng || item.seng_mg || 0);
      combined.serat_g += cleanNum(item.fiber || item.serat_g || 0);
      combined.thiamin_mg += cleanNum(item.thiamin || item.thiamin_mg || 0);
    });

    const nama_makanan = ingredients.map(i => i.name || i.nama).join(', ');

    const url = `https://smart-nutrition-tracker-production.up.railway.app/predict-with-recommendation?nama_makanan=${encodeURIComponent(nama_makanan)}&usia_bulan=${usia_bulan}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(combined)
    });

    if (response.ok) {
      const data = await response.json();
      res.json({
        success: true,
        data: {
          nama_makanan,
          label: data.label,
          confidence: data.confidence,
          rekomendasi: data.rekomendasi,
          rekomendasi_menu: data.rekomendasi_menu
        }
      });
    } else {
      throw new Error(`FastAPI returned status ${response.status}`);
    }

  } catch (err) {
    console.error('generateMenuFromIngredients error:', err);
    res.status(500).json({ error: 'Gagal memproses pembuatan resep menu AI.' });
  }
};

exports.predictSingleFood = async (req, res) => {
  try {
    const { food } = req.body;
    if (!food) {
      return res.status(400).json({ error: 'Data bahan makanan tidak boleh kosong.' });
    }

    // Calculate age in months
    let usia_bulan = 12;
    if (req.user && req.user.childProfile && req.user.childProfile.tanggalLahir) {
      const birthDate = new Date(req.user.childProfile.tanggalLahir);
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        let diff = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
        if (today.getDate() < birthDate.getDate()) {
          diff--;
        }
        usia_bulan = Math.max(0, diff);
      }
    }

    // Prepare body for FastAPI (16 nutrients)
    const body = {
      besi_mg: cleanNum(food.zatBesi || food.besi_mg || 0),
      energi_kal: cleanNum(food.kkal || food.energi_kal || 0),
      fosfor_mg: cleanNum(food.fosfor || food.fosfor_mg || 0),
      kalium_mg: cleanNum(food.kalium || food.kalium_mg || 0),
      kalsium_mg: cleanNum(food.kalsium || food.kalsium_mg || 0),
      karbo_g: cleanNum(food.carbohydrate || food.karbo_g || 0),
      lemak_g: cleanNum(food.fat || food.lemak_g || 0),
      natrium_mg: cleanNum(food.natrium || food.natrium_mg || 0),
      niasin_mg: cleanNum(food.niasin || food.niasin_mg || 0),
      protein_g: cleanNum(food.protein || food.protein_g || 0),
      retinol_mcg: cleanNum(food.retinol || food.retinol_mcg || 0),
      riboflavin_mg: cleanNum(food.riboflavin || food.riboflavin_mg || 0),
      seng_mg: cleanNum(food.seng || food.seng_mg || 0),
      serat_g: cleanNum(food.fiber || food.serat_g || 0),
      thiamin_mg: cleanNum(food.thiamin || food.thiamin_mg || 0),
      vit_c_mg: cleanNum(food.vitC || food.vit_c_mg || 0)
    };

    const nama_makanan = food.name || food.nama || 'Bahan Makanan';
    const url = `https://smart-nutrition-tracker-production.up.railway.app/predict?nama_makanan=${encodeURIComponent(nama_makanan)}&usia_bulan=${usia_bulan}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      res.json({
        success: true,
        data: {
          name: nama_makanan,
          label: data.label,
          confidence: data.confidence,
          rekomendasi: data.rekomendasi,
          probabilitas: data.probabilitas
        }
      });
    } else {
      throw new Error(`FastAPI returned status ${response.status}`);
    }
  } catch (err) {
    console.error('predictSingleFood error:', err);
    res.status(500).json({ error: 'Gagal memproses prediksi gizi bahan makanan.' });
  }
};

