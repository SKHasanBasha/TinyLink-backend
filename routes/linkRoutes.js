const express = require("express");
const router = express.Router();

const controller = require("../controllers/linkController");

router.get("/healthz", controller.healthCheck);

// CRUD
router.post("/api/links", controller.createLink);
router.get("/api/links", controller.listLinks);
router.get("/api/links/:code", controller.getStats);
router.delete("/api/links/:code", controller.deleteLink);

// redirect (must be last)
router.get("/:code", controller.redirect);

module.exports = router;
