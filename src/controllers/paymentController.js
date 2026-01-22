const orderModel = require("../models/orderModel");

exports.mockPayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "OrderId is required",
      });
    }

    const order = await orderModel.findOne({
      _id: orderId,
      userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "PAID") {
      return res.status(400).json({
        success: false,
        message: "Order already paid",
      });
    }

    order.paymentStatus = "PAID";
    order.paymentMethod = "MOCK";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Mock payment successful",
      data: order,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Mock payment failed",
    });
  }
};
