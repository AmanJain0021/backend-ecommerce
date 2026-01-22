const express=require('express');
const dotenv=require('dotenv');
const connectDB=require('./src/config/db.config');
const cors=require('cors');
const path=require('path');
dotenv.config();
const app=express();
const port=process.env.PORT;
const productRoutes=require("./src/routes/productRoute")
const userRoute=require("./src/routes/userRoute")
const cartRoute=require("./src/routes/cartRoute")
const orderRoute=require("./src/routes/orderRoute")
const paymentRoutes=require("./src/routes/paymentRoutes")
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.get('/',(req,res)=>{
    return res.send("Server is running");
})



//routes
app.use("/api/products",productRoutes);
app.use("/api/users",userRoute)
app.use("/api/cart",cartRoute)
app.use("/api/orders",orderRoute)
app.use("/api/payment", paymentRoutes);

const startServer=async()=>{
    try {
        await connectDB();
        app.listen(port,()=>{
            console.log('Server is started');
            console.log(`Server is running http:/localhost:${port}`);
            console.log("Database connected")
            
        })
    } catch (error) {
        console.error(`Server start failed `,error.message);
        
    }
}

startServer();