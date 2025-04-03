const router = require("express").Router();
const scheduleDocentController = require("../controllers/ScheduleDocentController");
const validateToken = require("../middlewares/token-validator");

router.get("/all", validateToken, scheduleDocentController.all);
router.post("/create", validateToken, scheduleDocentController.create);
router.get("/:id", validateToken, scheduleDocentController.search);
router.post("/delete/:id", validateToken, scheduleDocentController.delete);
router.post("/update/:id", validateToken, scheduleDocentController.update);

module.exports = router;