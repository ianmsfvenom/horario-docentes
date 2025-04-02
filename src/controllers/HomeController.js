const path = require("path");
const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

class HomeController {
    async index(req, res, next) {
        const authorization = req.cookies?.Authorization;
        if(!authorization) return res.redirect("/login");
        
        const userToken = jwt.decode(authorization.split(" ")[1]);
        if(userToken.id == null) return res.redirect("/login");

        const user = await prisma.usuarios.findUnique({ where: { id: userToken.id } });

        if(!user) {
            res.clearCookie("Authorization");
            return res.redirect("/login");
        }

        if(user.nivel_acesso === 'professor') res.sendFile(path.resolve(__dirname, "../../static/pages/docent/home.html"));
        else res.sendFile(path.resolve(__dirname, "../../static/pages/coordenator/home.html"));
    }

    async classes(req, res) {
        const authorization = req.cookies?.Authorization;
        if(!authorization) return res.redirect("/login");
        
        const userToken = jwt.decode(authorization.split(" ")[1]);
        if(userToken.id == null) return res.redirect("/login");

        const user = await prisma.usuarios.findUnique({ where: { id: userToken.id } });

        if(!user) {
            res.clearCookie("Authorization");
            return res.redirect("/login");
        }

        if(user.nivel_acesso === 'professor') return res.sendFile(path.resolve(__dirname, "../../static/pages/docent/classes.html"));
        else return res.sendFile(path.resolve(__dirname, "../../static/pages/coordenator/classes.html"));
    }

    async coordenators(req, res) {
        const authorization = req.cookies?.Authorization;
        if(!authorization) return res.redirect("/login");
        
        const userToken = jwt.decode(authorization.split(" ")[1]);
        if(userToken.id == null) return res.redirect("/login");

        const user = await prisma.usuarios.findUnique({ where: { id: userToken.id } });

        if(!user) {
            res.clearCookie("Authorization");
            return res.redirect("/login");
        }

        if(user.nivel_acesso === 'professor') return res.sendFile(path.resolve(__dirname, "../../static/pages/docent/coordenators.html"));
        else return res.sendFile(path.resolve(__dirname, "../../static/pages/coordenator/coordenators.html"));
    }

    async docents(req, res) {
        const authorization = req.cookies?.Authorization;
        if(!authorization) return res.redirect("/login");
        
        const userToken = jwt.decode(authorization.split(" ")[1]);
        if(userToken.id == null) return res.redirect("/login");

        const user = await prisma.usuarios.findUnique({ where: { id: userToken.id } });

        if(!user) {
            res.clearCookie("Authorization");
            return res.redirect("/login");
        }

        if(user.nivel_acesso === 'professor') return res.sendFile(path.resolve(__dirname, "../../static/pages/docent/docents.html"));
        else return res.sendFile(path.resolve(__dirname, "../../static/pages/coordenator/docents.html"));
    }
}

module.exports = new HomeController();