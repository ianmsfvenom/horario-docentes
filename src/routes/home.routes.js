const routes = require("express").Router();
const homeController = require("../controllers/HomeController");
const validateToken = require("../middlewares/token-validator");

routes.get('/', validateToken, homeController.index);
routes.get('/classes', validateToken, homeController.classes);
routes.get('/docents', validateToken, homeController.docents);
routes.get('/coordenators', validateToken, homeController.coordenators);

module.exports = routes;