// backend/src/routes/publicRoutes.js
const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

router.get("/companies", publicController.listAllCompanies);

router.get("/:slug", publicController.getCompanyPage);

router.post("/book", publicController.createPublicSchedule);

module.exports = router;
