const router = require("express").Router();
const coordenatorController = require("../controllers/CoordenatorController");
const validateToken = require("../middlewares/token-validator");

router.get("/all", validateToken, coordenatorController.all);

module.exports = router;