const express = require("express");
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes")

const app = express(); //server instance created
app.use(express.json()); //middleware created
app.use(cookieParser());
app.use('/api/auth',authRoutes)

module.exports = app;

