const prisma = require("../config/prisma");
const HttpError = require("../errors/HttpError");
const jwt = require("jsonwebtoken");

class DocentController {
    async index(req, res, next) {
        const authorization = req.cookies?.Authorization;
        if(!authorization) return res.redirect("/login");

        const user = jwt.decode(authorization.split(" ")[1]);
        if(user.id == null) return res.redirect("/login");
        
        const docents = await prisma.docentes.findFirst({ 
            where: { 
                usuarios: { 
                    some: { id: user.id } 
                } 
            }, include: { 
                horarios_docentes: { 
                    include: { turmas: true }
                }
            }
        });

        if(!docents) return next(new HttpError(404, "Docente não encontrado"));

        docents.horarios_docentes = docents.horarios_docentes.map(horario => {
            if(horario.dia_semana === "Ter_a") horario.dia_semana = "Terça";
            return horario;
        })

        res.json(docents);
    }

    async all(req, res, next) {
        const docents = await prisma.docentes.findMany();
        res.json(docents);
    }

    async search(req, res, next) {
        const { id } = req.params;
        const docent = await prisma.docentes.findUnique({ where: { id: Number(id) } });
        if(!docent) return next(new HttpError(404, "Docente não encontrado"));
        res.json(docent);
    }

    async delete(req, res, next) {
        const { id } = req.params;
        const docent = await prisma.docentes.findUnique({ where: { id: Number(id) } });
        if(!docent) return next(new HttpError(404, "Docente não encontrado"));

        await prisma.usuarios.delete({ where: { id: docent.usuarios[0].id } });
        await prisma.docentes.delete({ where: { id: Number(id) } });

        res.json({ status: 200, message: "Docente deletado com sucesso" });
    }
}

module.exports = new DocentController();