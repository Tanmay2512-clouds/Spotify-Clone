const express = require("express");
const cookieParser = require("cookie-parser")
const cors = require("cors")
const authRoutes = require("./routes/auth.routes")
const musicRoutes = require("./routes/music.routes")

const app = express(); //server instance created
app.use(cors({
	origin: process.env.FRONTEND_URL || "http://localhost:5173",
	credentials: true,
}));
app.use(express.json()); //middleware created
app.use(cookieParser());
app.use('/api/auth',authRoutes)
app.use('/api/music',musicRoutes)

module.exports = app;

