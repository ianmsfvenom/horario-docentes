const prisma = require("../config/prisma");
const HttpError = require("../errors/HttpError");
const formatToISO8601 = require("../utils/format-date");

class ScheduleDocentController {
    async all(req, res, next) {
        const scheduleDocents = await prisma.horarios_docentes.findMany({ include: { turmas: true, docentes: true } });
        res.json(scheduleDocents);
    }

    async create(req, res, next) {
        const { dia_semana, hora_inicio, hora_fim, turma_id, docente_id } = req.body;

        if(!dia_semana || !hora_inicio || !hora_fim || !turma_id || !docente_id) 
            return next(new HttpError(400, "Todos os campos são obrigatórios"));

        const newScheduleDocent = await prisma.horarios_docentes.create({ data: { 
            dia_semana: dia_semana, 
            hora_inicio: formatToISO8601(Number(hora_inicio.split(':')[0]), Number(hora_inicio.split(':')[1])),
            hora_fim: formatToISO8601(Number(hora_fim.split(':')[0]), Number(hora_fim.split(':')[1])),
            turma_id: Number(turma_id), 
            docente_id: Number(docente_id) 
        }, include: { turmas: true, docentes: true }});

        res.json(newScheduleDocent);
    }

    async search(req, res, next) {
        const { id } = req.params;
        const scheduleDocent = await prisma.horarios_docentes.findUnique({ where: { id: Number(id) }, include: { turmas: true, docentes: true } });
        if(!scheduleDocent) return next(new HttpError(404, "Horário não encontrado"));
        res.json(scheduleDocent);
    }

    async delete(req, res, next) {
        const { id } = req.params;
        const deletedScheduleDocent = await prisma.horarios_docentes.delete({ where: { id: Number(id) } });
        if(!deletedScheduleDocent) return next(new HttpError(404, "Horário não encontrado"));
        res.json({ status: 200, message: "Horário deletado com sucesso" });
    }

    async update(req, res, next) {
        const { id } = req.params;
        const { dia_semana, hora_inicio, hora_fim, turma_id, docente_id } = req.body;

        if(!dia_semana || !hora_inicio || !hora_fim || !turma_id || !docente_id) 
            return next(new HttpError(400, "Todos os campos são obrigatórios"));

        const updatedScheduleDocent = await prisma.horarios_docentes.update({ where: { id: Number(id) }, data: { 
            dia_semana: dia_semana, 
            hora_inicio: formatToISO8601(Number(hora_inicio.split(':')[0]), Number(hora_inicio.split(':')[1])),
            hora_fim: formatToISO8601(Number(hora_fim.split(':')[0]), Number(hora_fim.split(':')[1])),
            turma_id: Number(turma_id), 
            docente_id: Number(docente_id) 
        }, include: { turmas: true, docentes: true }});

        if(!updatedScheduleDocent) return next(new HttpError(404, "Horário não encontrado"));
        res.json(updatedScheduleDocent);
    }
}

module.exports = new ScheduleDocentController();