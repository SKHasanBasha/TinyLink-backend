const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// auto-create table on start
async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS links (
      id SERIAL PRIMARY KEY,
      code VARCHAR(8) UNIQUE NOT NULL,
      target TEXT NOT NULL,
      total_clicks INTEGER NOT NULL DEFAULT 0,
      last_clicked TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

init();

module.exports = {
  query: (q, params) => pool.query(q, params)
};
