const readline = require('readline');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "docverify",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

(async () => {
  try {
    const name = await ask('Name: ');
    const email = await ask('Email: ');
    const password = await ask('Password: ');
    const password_hash = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO super_admins (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, password_hash]
    );
    console.log('Super admin created successfully!');
  } catch (err) {
    console.error('Error creating super admin:', err.message);
  } finally {
    rl.close();
    process.exit();
  }
})(); 