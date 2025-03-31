const prisma = require("../config/prisma");

class ClassController {
    async all(req, res, next) {
        const classes = await prisma.turmas.findMany();
        res.json(classes);
    }

    async create(req, res, next) {
        const { nome, curso, periodo } = req.body;
        const newClass = await prisma.turmas.create({ data: { nome: nome, curso: curso, periodo: periodo } });
        res.json(newClass);
    }

    async delete(req, res, next) {
        const { id } = req.params;
        const deletedClass = await prisma.turmas.delete({ where: { id: Number(id) } });
        res.json(deletedClass);
    }

    async edit(req, res, next) {
        const { id } = req.params;
        const { nome, curso, periodo } = req.body;
        const editedClass = await prisma.turmas.update({ where: { id: Number(id) }, data: { nome: nome, curso: curso, periodo: periodo } });
        res.json(editedClass);
    }
}

module.exports = new ClassController();