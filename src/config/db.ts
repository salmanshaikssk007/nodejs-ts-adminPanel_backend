import mongoose = require('mongoose')


// @desc types for the function connectDB
type fnConnect = ()=>void;

const cyanColor = '\x1b[36m%s\x1b[0m' // ANSI escape code for color cyan
const red = '\x1b[31m' // ANSI escape code for color red

/**
 * Set an connection to the mongoDB Atlas
 *
 * @return void
 * @throws Error message when connection fails
 */

const connectDB:fnConnect  = async() =>{
    const MONGO_URI  = process.env.MONGO_URI
    try{
            const conn = await mongoose.connect(<string>MONGO_URI)
            console.log(cyanColor, `MongoDB Connected: ${conn.connection.host}`);  //cyan
        
    }catch(error:any){
        console.log( red , `Error: ${error.message}`);
        process.exit();
    }

}
export  {connectDB};