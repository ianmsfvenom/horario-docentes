const router = require("express").Router();
const { route } = require("express/lib/application");
const classController = require("../controllers/ClassController");
const validateToken = require("../middlewares/token-validator");

router.get("/all", validateToken, classController.all);
router.post("/create", validateToken, classController.create);
router.post("/delete/:id", validateToken, classController.delete);
router.post("/edit/:id", validateToken, classController.edit);

module.exports = router;