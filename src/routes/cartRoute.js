const mongoose=require("mongoose");
const express=require("express");
const cartRoute=express.Router();
const{addToCart,getCart,removeItemFromCart,decreaseItemQuantity}=require('../controllers/cartController')
const verifyToken = require("../middlewares/authMiddleware");


cartRoute.post('/add',verifyToken,addToCart)
cartRoute.get('/',verifyToken,getCart)
cartRoute.patch('/decrease',verifyToken,decreaseItemQuantity,)
cartRoute.delete("/remove", verifyToken, removeItemFromCart);

module.exports=cartRoute