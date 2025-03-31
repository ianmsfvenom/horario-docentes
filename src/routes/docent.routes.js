const router = require("express").Router();
const docentController = require("../controllers/DocentController");
const validateToken = require("../middlewares/token-validator");

router.get("/", validateToken, docentController.index);
router.get("/all", validateToken, docentController.all);
router.get("/:id", validateToken, docentController.search);

module.exports = router;