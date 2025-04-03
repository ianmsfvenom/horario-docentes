const router = require("express").Router();
const exportController = require("../controllers/ExportController");
const validateToken = require("../middlewares/token-validator");

router.post("/schedules", validateToken, exportController.schedules);
router.get("/classes", validateToken, exportController.classes);
router.get("/docents", validateToken, exportController.docents);
router.get("/coordenators", validateToken, exportController.coordinators);

module.exports = router;