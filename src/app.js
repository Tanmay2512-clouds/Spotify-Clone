const express = require("express");
const cookieParser = require("cookie-parser")

const app = express(); //server instance created
app.use(express.json()); //middleware created
app.use(cookieParser());

module.exports = app;

