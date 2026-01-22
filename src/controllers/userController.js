const userModel = require("../models/userModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.registerUser = async (req, res) => {
  try {

    const {name,email,password}=req.body;
    console.log("register---------------------");
    
if (!name || !email || !password) {
  return res.status(400).json({
    success: false,
    message: "Name, email and password are required"
  });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    success: false,
    message: "Invalid email format"
  });
}

if (password.length < 6) {
  return res.status(400).json({
    success: false,
    message: "Password must be at least 6 characters"
  });
}

const existingUser = await userModel.findOne({ email });

if (existingUser) {
  return res.status(409).json({
    success: false,
    message: "Email already registered"
  });
}

const hashedPassword = await bcrypt.hash(password, 10);


const user =await userModel.create({
    name,
    email,
    password:hashedPassword
});

return res.status(201).json({
  success: true,
  message: "User registered successfully",
  data: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log( email, password);
    
    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    // 2️⃣ Find user
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
