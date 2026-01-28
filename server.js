const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db.config");
const cors = require("cors");

dotenv.config();

const app = express();

/* ✅ CORS MUST BE FIRST */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fronecommerce.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  credentials: true
}));

/* body parsers AFTER cors */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* routes */
const productRoutes = require("./src/routes/productRoute");
const userRoute = require("./src/routes/userRoute");
const cartRoute = require("./src/routes/cartRoute");
const orderRoute = require("./src/routes/orderRoute");
const paymentRoutes = require("./src/routes/paymentRoutes");

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payment", paymentRoutes);

/* ✅ PORT FIX */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Database connected");
    });
  } catch (error) {
    console.error("Server start failed", error.message);
  }
};

startServer();
