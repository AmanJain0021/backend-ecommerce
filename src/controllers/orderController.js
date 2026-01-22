const mongoose=require('mongoose');
const orderModel=require('../models/orderModel');
const productModel=require('../models/productModel');
const cartModel=require('../models/cartModel');


exports.createOrder=async(req,res)=>{
    try {
        
        const userId=req.user.userId;

           
            if (!mongoose.Types.ObjectId.isValid(userId)) {
              return res.status(400).json({
                success: false,
                message: "Invalid userId",
              });
            }

            const cart=await cartModel.findOne({userId});
            if(!cart || cart.items.length===0){
                return res.status(200).json({
                    success:false,
                    data:{},
                    message:"Cart is empty"
                })
            }

            const order=new orderModel({
                userId,
                items:cart.items,
                totalAmount:cart.totalAmount
            });

            for (const item of cart.items) {
  const product = await productModel.findById(item.productId);
if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found during checkout"
  });
}

  if (product.stock < item.quantity) {
    return res.status(400).json({
        success:false,
        message:"the product is out of stock"
    })
  }

  product.stock -= item.quantity;
  await product.save();

}
await order.save();

//clear cart
cart.items=[];
cart.totalAmount=0;
await cart.save();

return res.status(201).json({
    success:true,
    message:"Order created successfully",
    data:order

})

    } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.getMyOrders = async (req, res) => {
  try {
    const userId  = req.user.userId; // later this will come from auth

    // 1️⃣ Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    // 2️⃣ Find orders
    const orders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 }); // latest first

    // 3️⃣ Return response
    return res.status(200).json({
      success: true,
      totalOrders: orders.length,
      data: orders,
      message: "Orders fetched successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
