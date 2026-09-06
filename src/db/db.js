const mongoose = require("mongoose")

async function connectionDB() {
    try{}catch(err){
        console.error("Database Connection error",err)
    }
    
}