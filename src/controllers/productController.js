const productModel = require("../models/productModel");
const mongoose=require('mongoose')
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;

    if (!name || name.trim() == "") {
      return res.status(400).json({
        success: false,
        message: "Please enter valid name ",
      });
    }
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price can't be less than zero",
      });
    }
    if (stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Product can't be negative",
      });
    }

    if (!description || description.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Product description is required",
      });
    }
    const product = await productModel.create({
      name,
      price,
      description,
      stock,
    });

    return res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find({
      isActive: true,
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      data: products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await productModel.findOne({
      _id: id,
      isActive: true,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateProduct = async (req, res) => {

  try {
    const productID =req.params.id;
    const { name, price, description, stock } = req.body;

    if(!mongoose.Types.ObjectId.isValid(productID)){
      return res.status(400).json({
        success:false,
        message:"Invalid product ID"
      })
    }

    const updateData={};

    if(name && name.trim()!==""){
      updateData.name=name;
    }
     if (price!= undefined) {
      if(price<=0){

      
      return res.status(400).json({
        success: false,
        message: "Price can't be less than zero",
      });
    }
    updateData.price=price;
    }
    if(stock!==undefined){

      if (stock < 0) {
        return res.status(400).json({
          success: false,
          message: "Product can't be negative",
        });
      }
      updateData.stock=stock;
    }

    if(description && description.trim()!==""){
      updateData.description=description;
    }
    const product=await productModel.findOneAndUpdate({
      _id:productID,
      isDeleted:false
    },{$set:updateData},
    
    {new:true}
    
    )
    if(!product){
      return res.status(404).json({
        success:false,
        message:"Product not found"
      })
    }

     return res.status(200).json({
        success:true,
        data:product,
        message:"Product updated successfully"
      })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.softDeleteProduct=async(req,res)=>{
 try {

  const productID=req.params.id;

   if (!mongoose.Types.ObjectId.isValid(productID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const product=await productModel.findOneAndUpdate({
      _id:productID,
      isDeleted:false},
      {$set:{isDeleted:true}},
      {new:true}
    )

        if(!product){
      return res.status(404).json({
        success:false,
        message:"Product not found"
      })
    }

    return res.status(200).json({
      success:true,
      message:"Product soft deleted successfully",
      data:product
    })


   } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};