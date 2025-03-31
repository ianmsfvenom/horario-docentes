const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const HttpError = require("../errors/HttpError");
const { encryptPassword } = require("../utils/encrypt-password");
const { comparePassword } = require("../utils/compare-password");

class LoginController {
    index(req, res) {
        res.sendFile(path.resolve(__dirname, "../../static/pages/login.html"));
    }
    
    registerDocent(req, res, next) {
        res.sendFile(path.resolve(__dirname, "../../static/pages/register-docent.html"));
    }

    registerCoordenator(req, res, next) {
        res.sendFile(path.resolve(__dirname, "../../static/pages/register-coordenator.html"));
    }

    async makeRegisterDocent(req, res, next) {
        const { user, password, name, area, email, phone, securityKey } = req.body;
        
        if(!user || !password || !area || !name || !email || !phone || !securityKey) 
            return next(new HttpError(400, "Preencha todos os campos obrigatórios"));

        if(process.env.SECURITY_KEY !== securityKey)
            return next(new HttpError(401, "Chave de segurança inválida"));


        const existingDocent = await prisma.docentes.findFirst({
            where: {
                OR: [
                    { email: email },
                    { telefone: phone },
                    { usuarios: { some: { usuario: user } } }
                ]
            }
        })

        if(existingDocent)
            return next(new HttpError(400, "Docente já cadastrado"));

        try {
            await prisma.docentes.create({
                data: {
                    area: area,
                    nome: name,
                    email: email,
                    telefone: phone,
                    usuarios: {
                        create: {
                            usuario: user,
                            senha: await encryptPassword(password),
                            nivel_acesso: "professor"
                        }
                    }
                }
            })
            res.json({
                status: 200,
                message: "Docente cadastrado com sucesso"
            })
        } catch (error) {
            next(new HttpError(500, "Erro ao cadastrar docente"));
            console.log(error);
        }
    }

    async makeRegisterCoordenator(req, res, next) {
        const { user, password, name, email, phone, securityKey } = req.body;
        
        if(!user || !password || !name || !email || !phone || !securityKey)
            return next(new HttpError(400, "Preencha todos os campos obrigatórios"));

        if(process.env.SECURITY_KEY !== securityKey)
            return next(new HttpError(401, "Chave de segurança inválida"));
        
        try {
            await prisma.coordenadores.create({
                data: {
                    nome: name,
                    email: email,
                    telefone: phone,
                    usuarios: {
                        create: {
                            usuario: user,
                            senha: await encryptPassword(password),
                            nivel_acesso: "coordenador"
                        }
                    }
                }
            })

            res.json({
                status: 200,
                message: "Coordenador cadastrado com sucesso"
            })
        } catch (error) {
            next(new HttpError(500, "Erro ao cadastrar coordenador"));
            console.log(error);
        }
    }

    async makeLogin(req, res, next) {
        const { user, password } = req.body;
            
        if(!user || !password)
            return next(new HttpError(400, "Preencha todos os campos obrigatórios"));

        const userFound = await prisma.usuarios.findFirst({
            where: {
                usuario: user
            }
        })

        if(!userFound)
            return next(new HttpError(401, "Usuário não encontrado"));

        const checkPassword = await comparePassword(password, userFound.senha);

        if(!checkPassword)
            return next(new HttpError(401, "Senha incorreta"));
        
        const privateKey = fs.readFileSync('./private.key', 'utf8');
        const token = jwt.sign({ id: userFound.id }, privateKey, { algorithm: 'RS256', expiresIn: "2h" });

        res.cookie("Authorization", 'Bearer ' + token, { httpOnly: true });
        res.json({
            status: 200,
            message: "Login realizado com sucesso"
        })
    }

    logout(req, res) {
        res.clearCookie("Authorization");
        res.redirect("/login");
    }
}

module.exports = new LoginController();