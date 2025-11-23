const db = require("../db");

module.exports = {
  create: async (code, target) => {
    return db.query(
      "INSERT INTO links(code, target) VALUES($1, $2)",
      [code, target]
    );
  },

  findByCode: async (code) => {
    return db.query("SELECT * FROM links WHERE code=$1", [code]);
  },

  list: async () => {
    return db.query(
      "SELECT code, target, total_clicks, last_clicked, created_at FROM links ORDER BY created_at DESC"
    );
  },

  delete: async (code) => {
    return db.query("DELETE FROM links WHERE code=$1", [code]);
  },

  incrementClick: async (code) => {
    return db.query(
      "UPDATE links SET total_clicks = total_clicks + 1, last_clicked = NOW() WHERE code = $1",
      [code]
    );
  }
};
