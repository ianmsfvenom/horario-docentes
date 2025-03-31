const router = require("express").Router();
const scheduleDocentController = require("../controllers/ScheduleDocentController");
const validateToken = require("../middlewares/token-validator");

router.get("/all", validateToken, scheduleDocentController.all);

module.exports = router;