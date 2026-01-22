const mongoose=require("mongoose");
const express=require("express");
const productRoutes=express.Router();
const {createProduct,getAllProducts,getProductById,updateProduct,softDeleteProduct}=require("../controllers/productController")

productRoutes.post('/',createProduct)
productRoutes.get('/',getAllProducts)
productRoutes.get('/:id',getProductById)
productRoutes.put('/:id',updateProduct)
productRoutes.patch('/:id',softDeleteProduct)


module.exports=productRoutes,getAllProducts,getProductById,updateProduct,softDeleteProduct