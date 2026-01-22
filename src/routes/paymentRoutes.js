const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const { mockPayment } = require("../controllers/paymentController");
router.post("/mock", verifyToken, mockPayment);

module.exports = router;
