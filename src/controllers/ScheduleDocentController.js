const prisma = require("../config/prisma");


class ScheduleDocentController {
    async all(req, res, next) {
        const scheduleDocents = await prisma.horarios_docentes.findMany({ include: { turmas: true, docentes: true } });
        res.json(scheduleDocents);
    }
}

module.exports = new ScheduleDocentController();