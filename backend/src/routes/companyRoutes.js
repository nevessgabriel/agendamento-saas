// backend/src/routes/companyRoutes.js
const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const authMiddleware = require("../middlewares/authMiddleware");

// Apply authentication middleware to all routes in this file
router.use(authMiddleware);

// Route to get company data
router.get("/me", companyController.getMyCompany);

// Route to update company data
router.put("/me", companyController.updateCompany);

module.exports = router;
