const mongoose=require("mongoose");
const express=require("express");
const cartRoute=express.Router();
const{addToCart,getCart,removeItemFromCart}=require('../controllers/cartController')
const verifyToken = require("../middlewares/authMiddleware");


cartRoute.post('/add',verifyToken,addToCart)
cartRoute.get('/',verifyToken,getCart)
cartRoute.delete("/remove", verifyToken, removeItemFromCart);

module.exports=cartRoute