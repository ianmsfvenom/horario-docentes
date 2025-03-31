const jwt = require("jsonwebtoken");
const fs = require("fs");
const privateKey = fs.readFileSync('./private.key', 'utf8');

const validateToken = async (req, res, next) => {
    const token = req.cookies?.Authorization;
    
    if(!token)
        return res.redirect("/login");

    try {
        jwt.verify(token.split(" ")[1], privateKey);
        next();
    } catch (error) {
        res.redirect("/login");
    }

}

module.exports = validateToken;