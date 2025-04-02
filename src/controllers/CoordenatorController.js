const prisma = require("../config/prisma");
const HttpError = require("../errors/HttpError");
const jwt = require("jsonwebtoken");
const { encryptPassword } = require("../utils/encrypt-password");

class CoordenatorController {

    async index(req, res, next) {
        const authorization = req.cookies?.Authorization;
        if(!authorization) return res.redirect("/login");

        const user = jwt.decode(authorization.split(" ")[1]);
        if(user.id == null) return res.redirect("/login");
        
        const coordenators = await prisma.coordenadores.findFirst({ 
            where: { 
                usuarios: { 
                    some: { id: user.id } 
                } 
            }, include: {
                usuarios: true,
            }
        });

        if(!coordenators) return next(new HttpError(404, "Coordenador não encontrado"));

        res.json(coordenators);
    }

    async all(req, res, next) {
        const coordinators = await prisma.coordenadores.findMany();
        res.json(coordinators);
    }

    async update(req, res, next) {
        const authorization = req.cookies?.Authorization;
        if(!authorization) return res.redirect("/login");

        const user = jwt.decode(authorization.split(" ")[1]);
        if(user.id == null) return res.redirect("/login");
        const { name, email, telefone, username, password } = req.body;
        
        if(!name || !email || !telefone || !username) return next(new HttpError(400, "Preencha todos os campos obrigatórios"));

        var passwordHash = undefined;
        if(password) passwordHash = await encryptPassword(password);
        
        const coordenator = await prisma.coordenadores.findFirst({
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

        if(!coordenator) return next(new HttpError(404, "Coordenador não encontrado"));

        const updatedCoordenator = await prisma.coordenadores.update({
            where: {
                id: coordenator.id
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

        if(!updatedCoordenator) return next(new HttpError(500, "Erro ao atualizar coordenador"));

        if(password || coordenator.usuarios[0].usuario !== username) {
            res.clearCookie("Authorization");
        }

        res.json(updatedCoordenator);
    }


    async delete(req, res, next) {
        const { id } = req.params;

        const coordenator = await prisma.coordenadores.findUnique({ where: { id: Number(id) }, include: { usuarios: true } });
        if(!coordenator) return next(new HttpError(404, "Coordenador não encontrado"));

        await prisma.usuarios.deleteMany({
            where: { coordenador_id: coordenator.id }
        });

        await prisma.coordenadores.delete({ where: { id: coordenator.id }});

        res.json({ status: 200, message: "Coordenador deletado com sucesso" });
    }
}

module.exports = new CoordenatorController();