const mongoose=require('mongoose');
const cartModel=require('../models/cartModel');
const productModel=require('../models/productModel');


exports.addToCart = async (req, res) => {
  try {
    const userId=req.user.userId;
    const { productId, quantity } = req.body;

    // 1️⃣ Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // 2️⃣ Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    // 3️⃣ Find product (only active & non-deleted)
    const product = await productModel.findOne({
      _id: productId,
      isActive: true,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 4️⃣ Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough product stock",
      });
    }

    // 5️⃣ Find user's cart
    let cart = await cartModel.findOne({ userId });

    // 6️⃣ If cart does not exist → create new
    if (!cart) {
      cart = new cartModel({
        userId,
        items: [
          {
            productId,
            quantity,
            price: product.price,
          },
        ],
        totalAmount: quantity * product.price

      });
    } else {
      // 7️⃣ If cart exists → check product in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // product already in cart → increase quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // product not in cart → push new item
        cart.items.push({
          productId,
          quantity,
          price: product.price,
        });
      }
    }

    // 8️⃣ Recalculate totalAmount
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // 9️⃣ Save cart
    await cart.save();

    // 🔟 Return response
    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: cart,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
          totalAmount: 0,
        },
        message: "Cart is empty",
      });
    }

    return res.status(200).json({
      success: true,
      data: cart,
      message: "Cart fetched successfully",
    });

  } catch (error) {
    console.error("GET CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.removeItemFromCart = async (req, res) => {
try {
  const userId=req.user.userId;
  const {productId}=req.body;
    // 1️⃣ Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId or productId",
      });
    }
  const cart=await cartModel.findOne({userId});
  if(!cart){
    return res.status(200).json({
      success:true,
      data:{
        items:[],
        totalAmount:0,
      },
      message:"Cart is empty"
    })
  }
     const originalLength = cart.items.length;

     


  cart.items=cart.items.filter(
    item=>item.productId.toString()!==productId
  );

  
    if (cart.items.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // 5️⃣ Recalculate totalAmount
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

  await cart.save();

  return res.status(200).json({
    success:"Item removed successfully",
    data:cart
  })
  
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.decreaseItemQuantity = async (req, res) => {
 try {
  const userId=req.user.userId;
  const {productId}=req.body;  // 1️⃣ Validate IDs

  if (!req.user || !req.user.userId) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized acess",
  });
}

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId or productId",
      });
    }

    const cart=await cartModel.findOne({userId});

    if(!cart){
    return res.status(200).json({
      success:true,
      data:{
        items:[],
        totalAmount:0,
      },
      message:"Cart is empty"
    })
    }

    const itemIndex = cart.items.findIndex(
  item => item.productId.toString() === productId
);

if(itemIndex===-1){
  return res.status(404).json({
    success:false,
    message:"Product not found"
  })
}
if (cart.items[itemIndex].quantity > 1) {
  cart.items[itemIndex].quantity -= 1;
} else {
  cart.items.splice(itemIndex, 1);
}

cart.totalAmount = cart.items.reduce(
  (sum, item) => sum + item.quantity * item.price,
  0
);

await cart.save();
return res.status(200).json({
  success: true,
  message: "Item quantity updated successfully",
  data: cart
});


   } catch (error) {
    return res.status(500).json({
      success: false,
      message:error.message
     
    });
  }
};