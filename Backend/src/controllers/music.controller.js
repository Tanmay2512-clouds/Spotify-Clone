const musicModel = require("../models/music.models");
const albumModel = require("../models/album.model")
const { uploadFile } = require("../services/storage.service");
const jwt = require("jsonwebtoken");

async function createMusic(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    if (decoded.role !== "artist") {
        return res.status(403).json({
            message: "You don't have access to create music"
        });
    }

    const { title } = req.body;
    const file = req.file;

    if (!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    if (!file) {
        return res.status(400).json({
            message: "Music file is required"
        });
    }

    try {
        const result = await uploadFile(
            file.buffer.toString("base64")
        );

        console.log("IMAGEKIT RESULT:", result);

        const music = await musicModel.create({
            uri: result.url,
            title: title,
            artist: decoded.id
        });

        return res.status(201).json({
            message: "Music created successfully",
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist
            }
        });

    } catch (err) {
        console.error("CREATE MUSIC ERROR:", err);

        return res.status(500).json({
            message: "Failed to create music",
            error: err.message
        });
    }
}

async function createAlbum(req,res){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }

    let decoded;
    try{
        decoded = jwt.verify(token,process.env.JWT_SECRET)
    } catch(err) {
        return res.status(401).json({message:"Unauthorized"})
    }

    if(decoded.role !== "artist"){
        return res.status(403).json({message:"You don't have access to create Album"})
    }

    const {title, musicIds, musics} = req.body;
    const selectedMusicIds = musicIds ?? musics;

    if(!title || !Array.isArray(selectedMusicIds)){
        return res.status(400).json({
            message:"Title and musicIds array are required"
        });
    }

    try{
        const album = await albumModel.create({
            title,
            artist:decoded.id,
            musics:selectedMusicIds
        });

        return res.status(201).json({
            message:"Album Created Successfully",
            album:{
                id:album._id,
                title:album.title,
                artist:album.artist,
                musics:album.musics,
            }
        });
    } catch(err){
        console.error("CREATE ALBUM ERROR:", err);
        const statusCode = err.name === "ValidationError" || err.name === "CastError" ? 400 : 500;
        return res.status(statusCode).json({
            message:"Failed to create album",
            error:err.message
        });
    }
}



module.exports = {
    createMusic,
    createAlbum
};

