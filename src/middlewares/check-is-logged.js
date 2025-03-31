const jwt = require("jsonwebtoken");
const fs = require("fs");
const privateKey = fs.readFileSync('./private.key', 'utf8');
const checkIsLogged = async (req, res, next) => {
    const token = req.cookies?.Authorization;
    if(!token) return next();

    try {
        jwt.verify(token.split(" ")[1], privateKey);
        res.redirect("/home");
    } catch (error) {
        next();
    }
}

module.exports = checkIsLogged;