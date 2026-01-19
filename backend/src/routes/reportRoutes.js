// backend/src/routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/summary", reportsController.getSummary);
router.get("/charts", reportsController.getChartData);

module.exports = router;
