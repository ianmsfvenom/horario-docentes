const prisma = require("../config/prisma");


class ScheduleDocentController {
    async all(req, res, next) {
        const scheduleDocents = await prisma.horarios_docentes.findMany({ include: { turmas: true, docentes: true } });
        res.json(scheduleDocents);
    }

    async create(req, res, next) {
        const { dia_semana, hora_inicio, hora_fim, turma_id, docente_id } = req.body;

        console.log(dia_semana, hora_inicio, hora_fim, turma_id, docente_id);
        
        const dateStart = new Date();
        dateStart.setHours(hora_inicio.split(':')[0], hora_inicio.split(':')[1], 0, 0);

        const dateEnd = new Date();
        dateEnd.setHours(hora_fim.split(':')[0], hora_fim.split(':')[1], 0, 0);

        const newScheduleDocent = await prisma.horarios_docentes.create({ data: { 
            dia_semana: dia_semana, 
            hora_inicio: dateStart, 
            hora_fim: dateEnd, 
            turma_id: Number(turma_id), 
            docente_id: Number(docente_id) 
        }, include: { turmas: true, docentes: true }});

        res.json(newScheduleDocent);
    }
}

module.exports = new ScheduleDocentController();