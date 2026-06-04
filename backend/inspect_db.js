const mysql = require('mysql2/promise');

async function inspect() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'smart nutrition tracker'
    });
    
    console.log('--- USERS TABLE COLUMNS ---');
    const [fields] = await conn.query('SHOW COLUMNS FROM users');
    console.log(fields.map(f => `${f.Field}: ${f.Type}`));

    console.log('--- USERS DATA ---');
    const [rows] = await conn.query('SELECT * FROM users');
    console.log(JSON.stringify(rows, null, 2));

    await conn.end();
  } catch (err) {
    console.error('Error inspecting database:', err);
  }
}

inspect();
