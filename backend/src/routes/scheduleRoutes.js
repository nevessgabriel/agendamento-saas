const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", scheduleController.listSchedules);
router.post("/", scheduleController.createSchedule);
router.delete("/:id", scheduleController.deleteSchedule);
router.get('/history', scheduleController.getHistory);

module.exports = router;
