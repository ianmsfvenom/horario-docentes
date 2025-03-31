const prisma = require("../config/prisma");

class CoordenatorController {
    async all(req, res, next) {
        const coordinators = await prisma.coordenadores.findMany();
        res.json(coordinators);
    }
}

module.exports = new CoordenatorController();