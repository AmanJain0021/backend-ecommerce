const mongoose=require("mongoose");

const connectDB=async()=>{
    try {
        
        const url=process.env.MONGODB_URL;
        console.log(`[mongoDB] Database connecting...`);
        const con=await mongoose.connect(url);
        console.log(`[Mongodb] ${con.connection.host}`);
        
        
    } catch (error) {
  console.error("MongoDB connection failed:", error.message);
  process.exit(1); // ⬅️ STOP SERVER
}

}
module.exports=connectDB;