const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function registerUser(req, res) {
    const { username, email, password, role = "user" } = req.body;

    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (isUserAlreadyExist) {
        return res.status(409).json({
            message: "User Already Exists"
        });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash, // ✅ store hashed password
        role,
    });

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET
    );

    res.cookie("token", token);

    res.status(201).json({
        message: "User Registered Successfully",
        user: {
            id: user._id, // ✅ fixed
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
}

async function loginUser(req,res){
    const {username,email,password} = req.body;

    const user = await userModel.findOne({
        $or:{
            
        }
    })
}

module.exports = { registerUser };