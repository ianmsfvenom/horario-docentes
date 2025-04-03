const { jsPDF } = require('jspdf')
const { autoTable } = require('jspdf-autotable');
const prisma = require("../config/prisma");

class ExportController {
    async schedules(req, res) {
        const schedulesArray = req.body;

        if(Array.isArray(schedulesArray)) {
            const doc = new jsPDF();
            const schedules = schedulesArray.map(schedule => {
                return [schedule.docente, schedule.turma, schedule.dia_semana, schedule.hora_inicio, schedule.hora_fim]
            })

            autoTable(doc, {
                head: [['Docente', 'Turma', 'Dia da semana', 'Inicio', 'Saida']],
                body: schedules
            })

            const buffer = Buffer.from(doc.output('arraybuffer'));

            res.set({
                'Content-Disposition': 'attachment; filename="export.pdf"',
                'Content-Type': 'application/pdf',
                'Content-Length': buffer.length
            });
            return res.send(buffer);
        } else {
            return res.status(400).json({ error: "Nenhum horário informado" });
        }
    }

    async docents(req, res) {

        const allDocents = await prisma.docentes.findMany();
        const docentsFiltered = allDocents.map(docent => {
            return [docent.nome, docent.area, docent.email, docent.telefone]
        })

        const doc = new jsPDF();
        autoTable(doc, {
            head: [['Nome', 'Área', 'Email', 'Telefone']],
            body: docentsFiltered
        })

        const buffer = Buffer.from(doc.output('arraybuffer'));

        res.set({
            'Content-Disposition': 'attachment; filename="export.pdf"',
            'Content-Type': 'application/pdf',
            'Content-Length': buffer.length
        });

        return res.send(buffer);
    }

    async classes(req, res) {
        const allClasses = await prisma.turmas.findMany();
        const classesFiltered = allClasses.map(classe => {
            return [classe.curso, classe.nome, classe.periodo]
        })

        const doc = new jsPDF();
        autoTable(doc, {
            head: [['Curso', 'Nome', 'Período']],
            body: classesFiltered
        })

        const buffer = Buffer.from(doc.output('arraybuffer'));

        res.set({
            'Content-Disposition': 'attachment; filename="export.pdf"',
            'Content-Type': 'application/pdf',
            'Content-Length': buffer.length
        });

        return res.send(buffer);
    }

    async coordinators(req, res) {
        const allCoordinators = await prisma.coordenadores.findMany();
        const coordinatorsFiltered = allCoordinators.map(coordinator => {
            return [coordinator.nome, coordinator.email, coordinator.telefone]
        })

        const doc = new jsPDF();
        autoTable(doc, {
            head: [['Nome', 'Email', 'Telefone']],
            body: coordinatorsFiltered
        })

        const buffer = Buffer.from(doc.output('arraybuffer'));

        res.set({
            'Content-Disposition': 'attachment; filename="export.pdf"',
            'Content-Type': 'application/pdf',
            'Content-Length': buffer.length
        });

        return res.send(buffer);
    }
}

module.exports = new ExportController();