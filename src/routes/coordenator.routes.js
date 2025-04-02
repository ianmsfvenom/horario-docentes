const router = require("express").Router();
const coordenatorController = require("../controllers/CoordenatorController");
const validateToken = require("../middlewares/token-validator");

router.get("/", validateToken, coordenatorController.index);
router.get("/all", validateToken, coordenatorController.all);
router.post("/update", validateToken, coordenatorController.update);
router.post("/delete/:id", validateToken, coordenatorController.delete);

module.exports = router;