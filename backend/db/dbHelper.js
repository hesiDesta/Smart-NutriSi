const mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'smart nutrition tracker';
const DB_PORT = process.env.DB_PORT || 3306;

// 1. Membuat Pool Koneksi MySQL
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 2. Membuat tabel otomatis jika belum ada saat server start
async function initDb() {
  try {
    // Buat database jika belum ada
    const tempConn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT
    });
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await tempConn.end();

    // Membuat tabel users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        parent_name VARCHAR(100),
        child_name VARCHAR(100),
        birth_date DATE,
        gender VARCHAR(20),
        height FLOAT,
        weight FLOAT,
        allergy VARCHAR(100),
        special_condition VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Membuat tabel logs (riwayat pencatatan makanan)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        meal_type VARCHAR(50) NOT NULL,
        food_json JSON NOT NULL,
        gram FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    // Alter table to add parent_name column if it was created in an earlier migration without it
    try {
      await pool.query('ALTER TABLE users ADD COLUMN parent_name VARCHAR(100)');
    } catch (e) {
      // Ignore if column already exists
    }

    console.log('✅ Database MySQL (smart nutrition tracker) & tabel berhasil diinisialisasi!');
  } catch (err) {
    console.error('❌ Gagal inisialisasi tabel MySQL:', err.message);
  }
}

// 3. Mapping hasil query database agar sesuai format objek yang diharapkan oleh Controller
function mapUserResult(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    password: row.password,
    parentName: row.parent_name,
    childProfile: row.child_name ? {
      namaAnak: row.child_name,
      tanggalLahir: row.birth_date ? new Date(row.birth_date).toISOString().split('T')[0] : null,
      jenisKelamin: row.gender,
      tinggiBadan: row.height,
      beratBadan: row.weight,
      alergi: row.allergy,
      kondisiKhusus: row.special_condition
    } : null,
    createdAt: row.created_at
  };
}

function mapLogResult(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date instanceof Date ? row.date.toISOString().split('T')[0] : row.date,
    mealType: row.meal_type,
    food: typeof row.food_json === 'string' ? JSON.parse(row.food_json) : row.food_json,
    gram: row.gram,
    createdAt: row.created_at
  };
}

// 4. Operasi CRUD USER (Sesuai antarmuka sebelumnya)
const Users = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows.map(mapUserResult);
  },

  async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return mapUserResult(rows[0]);
  },
  
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return mapUserResult(rows[0]);
  },
  
  async create(user) {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    await pool.query(
      'INSERT INTO users (id, username, password, parent_name) VALUES (?, ?, ?, ?)',
      [id, user.username, user.password, user.parentName]
    );
    return { id, username: user.username, parentName: user.parentName };
  },
  
  async updateChildProfile(userId, profile) {
    await pool.query(
      `UPDATE users SET 
        child_name = ?, 
        birth_date = ?, 
        gender = ?, 
        height = ?, 
        weight = ?, 
        allergy = ?, 
        special_condition = ?,
        parent_name = COALESCE(?, parent_name)
       WHERE id = ?`,
      [
        profile.namaAnak,
        profile.tanggalLahir,
        profile.jenisKelamin,
        profile.tinggiBadan,
        profile.beratBadan,
        profile.alergi,
        profile.kondisiKhusus,
        profile.parentName || null,
        userId
      ]
    );
    const updated = await this.findById(userId);
    return updated;
  }
};

// 5. Operasi CRUD LOG MAKANAN (Sesuai antarmuka sebelumnya)
const Logs = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM logs');
    return rows.map(mapLogResult);
  },

  async getByUserAndDate(userId, date) {
    const [rows] = await pool.query('SELECT * FROM logs WHERE user_id = ? AND date = ?', [userId, date]);
    return rows.map(mapLogResult);
  },
  
  async getByUserHistory(userId) {
    const [rows] = await pool.query('SELECT * FROM logs WHERE user_id = ?', [userId]);
    return rows.map(mapLogResult);
  },
  
  async create(log) {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const foodJson = JSON.stringify(log.food);
    await pool.query(
      'INSERT INTO logs (id, user_id, date, meal_type, food_json, gram) VALUES (?, ?, ?, ?, ?, ?)',
      [id, log.userId, log.date, log.mealType, foodJson, log.gram]
    );
    return {
      id,
      userId: log.userId,
      date: log.date,
      mealType: log.mealType,
      food: log.food,
      gram: log.gram
    };
  },
  
  async delete(id, userId) {
    const [result] = await pool.query('DELETE FROM logs WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows > 0;
  }
};

module.exports = {
  initDb,
  Users,
  Logs
};
