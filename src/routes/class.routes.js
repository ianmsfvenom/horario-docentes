const router = require("express").Router();
const classController = require("../controllers/ClassController");
const validateToken = require("../middlewares/token-validator");

router.get("/all", validateToken, classController.all);

module.exports = router;