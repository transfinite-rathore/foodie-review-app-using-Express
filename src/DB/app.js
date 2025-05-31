import mongoose from "mongoose";


const connectDB = async ()=>{
    try {
        const connectionAckg = await mongoose.connect(process.env.DB_URI+"/"+process.env.DB_NAME)
        console.log(`Connection successfull ${connectionAckg.connection.host}`)

    } catch (error) {
        console.log("Connecttion Error ",error)
        process.exit(1)
        
    }
}


export default connectDB