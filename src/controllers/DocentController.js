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
                },
                usuarios: true
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
        const docent = await prisma.docentes.findUnique({ where: { id: Number(id) }, include: { usuarios: true } });
        if(!docent) return next(new HttpError(404, "Docente não encontrado"));
        res.json(docent);
    }

    async delete(req, res, next) {
        const { id } = req.params;
        
        const docent = await prisma.docentes.findUnique({ where: { id: Number(id) }, include: { usuarios: true, horarios_docentes: true } });
        if(!docent) return next(new HttpError(404, "Docente não encontrado"));
        
        await prisma.usuarios.deleteMany({
            where: { docente_id: docent.id }
        });

        await prisma.horarios_docentes.deleteMany({
            where: { docente_id: docent.id }
        });

        await prisma.docentes.delete({ where: { id: docent.id }});

        res.json({ status: 200, message: "Docente deletado com sucesso" });
    }

    async update(req, res, next) {
        const authorization = req.cookies?.Authorization;
        if(!authorization) return res.redirect("/login");

        const user = jwt.decode(authorization.split(" ")[1]);
        if(user.id == null) return res.redirect("/login");
        const { name, email, telefone, username, password, area } = req.body;
        
        if(!name || !email || !telefone || !username || !area) return next(new HttpError(400, "Preencha todos os campos obrigatórios"));

        var passwordHash = undefined;
        if(password) passwordHash = await encryptPassword(password);
        
        const docent = await prisma.docentes.findFirst({
            where: {
                usuarios: {
                    some: {
                        id: user.id
                    }
                }
            },
            include: {
                usuarios: true
            }
        });

        if(!docent) return next(new HttpError(404, "Docente não encontrado"));
        const updatedDocent = await prisma.docentes.update({
            where: {
                id: docent.id
            },
            data: {
                nome: name,
                email: email,
                telefone: telefone,
                usuarios: {
                    update: {
                        where: {
                            id: user.id
                        },
                        data: {
                            usuario: username,
                            senha: passwordHash
                        }
                    }
                }
            }
        });

        if(!updatedDocent) return next(new HttpError(500, "Erro ao atualizar coordenador"));

        if(password || docent.usuarios[0].usuario !== username) {
            res.clearCookie("Authorization");
        }

        res.json(updatedDocent);
    }
}

module.exports = new DocentController();