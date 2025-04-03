const env = require("dotenv");
env.config();

const express = require("express");
const app = express();
const homeRouter = require("./src/routes/home.routes");
const loginRouter = require("./src/routes/login.routes");
const docentRouter = require("./src/routes/docent.routes");
const classRouter = require("./src/routes/class.routes");
const scheduleRouter = require("./src/routes/schedule.routes");
const coordenatorRouter = require("./src/routes/coordenator.routes");
const exportRouter = require("./src/routes/export.route");
const HttpError = require("./src/errors/HttpError");
const cookieParser = require("cookie-parser");
app.use(express.static('static'));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => res.redirect("/home"));

app.use("/home", homeRouter);
app.use("/login", loginRouter);
app.use("/docent", docentRouter);
app.use('/class', classRouter);
app.use("/schedule", scheduleRouter);
app.use("/coordenator", coordenatorRouter);
app.use("/export", exportRouter);

app.use((err, req, res, next) => {
    if(err instanceof HttpError) 
        res.status(err.statusCode).json({ status: err.statusCode, message: err.message });
    next();
})

app.listen(3000, async () => {
    console.log("Server running on port http://localhost:3000");
});

module.exports = { app };