const route = require("express").Router();
const loginController = require("../controllers/LoginController");
const checkIsLogged = require("../middlewares/check-is-logged");

route.get("/", checkIsLogged, loginController.index);
route.get("/register/docent", checkIsLogged, loginController.registerDocent);
route.get("/register/coordenator", checkIsLogged, loginController.registerCoordenator);

route.post("/register/docent", checkIsLogged, loginController.makeRegisterDocent);
route.post("/register/coordenator", checkIsLogged, loginController.makeRegisterCoordenator);
route.post("/", checkIsLogged, loginController.makeLogin);

route.get("/logout", loginController.logout);

module.exports = route;