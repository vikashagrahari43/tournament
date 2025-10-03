import mongoose from "mongoose";

const MONGO_URL = process.env.MONGODB_URI!

if(!MONGO_URL){
    throw new Error("Please define mongo_uri in env variables");
}

let cached = global.mongoose ;

if(!cached){
  cached = global.mongoose = {
    conn: null , 
    promise : null ,  
  }
}

export async function connecttoDatabase() {
    if(cached.conn) return cached.conn ;

    if(!cached.promise){
      cached.promise =  mongoose.connect(MONGO_URL).then(() => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null ;
        throw error 
    }

    return cached.conn ;
 }  
