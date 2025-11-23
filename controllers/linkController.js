const Link = require("../models/linkModel");
const { validateUrl, validateCode, CODE_REGEX } = require("../validators/linkValidator");

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateCode() {
  return [...Array(6)]
    .map(() => CHARSET[Math.floor(Math.random() * CHARSET.length)])
    .join("");
}

module.exports = {

  healthCheck: (req, res) => {
    res.json({ ok: true, version: "1.0", uptime: process.uptime() });
  },

  createLink: async (req, res) => {
    let { target, code } = req.body;

    if (!target) return res.status(400).json({ error: "target is required" });
    if (!validateUrl(target)) return res.status(400).json({ error: "invalid URL" });

    if (code) {
      if (!validateCode(code))
        return res.status(400).json({ error: "invalid code format" });

      const exists = await Link.findByCode(code);
      if (exists.rowCount > 0)
        return res.status(409).json({ error: "code already exists" });
    } else {
      let tries = 0;
      while (tries < 10) {
        const generated = generateCode();
        const exists = await Link.findByCode(generated);
        if (exists.rowCount === 0) {
          code = generated;
          break;
        }
        tries++;
      }
      if (!code)
        return res.status(500).json({ error: "failed to generate code" });
    }

    await Link.create(code, target);

    res.status(201).json({
      code,
      shortUrl: `${process.env.BASE_URL}/${code}`,
      target,
      total_clicks: 0
    });
  },

  listLinks: async (req, res) => {
    const result = await Link.list();
    res.json(result.rows);
  },

  getStats: async (req, res) => {
    const code = req.params.code;

    if (!validateCode(code))
      return res.status(404).json({ error: "not found" });

    const result = await Link.findByCode(code);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "not found" });

    res.json(result.rows[0]);
  },

  deleteLink: async (req, res) => {
    const code = req.params.code;

    if (!validateCode(code))
      return res.status(404).json({ error: "not found" });

    const existing = await Link.findByCode(code);
    if (existing.rowCount === 0)
      return res.status(404).json({ error: "not found" });

    await Link.delete(code);
    res.status(204).send();
  },

  redirect: async (req, res) => {
    const code = req.params.code;

    if (!validateCode(code)) return res.status(404).send("Not found");

    const result = await Link.findByCode(code);
    if (result.rowCount === 0) return res.status(404).send("Not found");

    await Link.incrementClick(code);

    res.redirect(302, result.rows[0].target);
  }
};
