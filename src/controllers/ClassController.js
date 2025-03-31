const prisma = require("../config/prisma");

class ClassController {
    async all(req, res, next) {
        const classes = await prisma.turmas.findMany();
        res.json(classes);
    }
}

module.exports = new ClassController();