const mongoose=require("mongoose");
const express=require("express");
const orderRoute=express.Router();
const{createOrder,getMyOrders,}=require('../controllers/orderController')
const verifyToken = require("../middlewares/authMiddleware");

orderRoute.post('/create',verifyToken,createOrder)
orderRoute.get('/my',verifyToken,getMyOrders)


module.exports=orderRoute