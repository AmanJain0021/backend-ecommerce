const mongoose=require("mongoose");
const express=require("express");
const userRoute=express.Router();
const{registerUser,loginUser}=require('../controllers/userController')

userRoute.post('/register',registerUser)
userRoute.post('/login',loginUser)


module.exports=userRoute