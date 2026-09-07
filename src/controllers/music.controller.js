const musicModel = require("../models/music.models")
const jwt = require("jsonwebtoken")

async function createMusic(req,res) {

    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    try{
        jwt.verify(token,process.env.JWT_SECRET)
    }catch(err){
        return res.status(401).json({message:"Unauthorized"})
    }
    
}