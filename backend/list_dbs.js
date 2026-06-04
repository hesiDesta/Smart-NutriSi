const mysql = require('mysql2/promise');

async function listDbs() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    const [rows] = await conn.query('SHOW DATABASES');
    console.log(rows);
    await conn.end();
  } catch (err) {
    console.error(err);
  }
}
listDbs();
