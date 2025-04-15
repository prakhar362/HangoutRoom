const { userModel } =require ("../models/userModel");
const bcrypt = require("bcrypt");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
require("dotenv").config();

//  Zod for validation
const signupSchema = zod.object({
    email: zod.string().email("Invalid email format"),
    password: zod.string().min(6, "Password must be at least 6 characters long"),
    userName: zod.string().nonempty("Username is required"),
  });

async function signup(req, res) {
    try {
        const { email, password, userName } = signupSchema.parse(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create the user in the database
        await userModel.create({
          email,
          password: hashedPassword,
          userName,
        });
    
        res.status(201).json({
          message: "Signup succeeded",
        });
      } catch (err) {
        if (err instanceof zod.ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: err.errors,
          });
        }
        console.error(err);
        res.status(500).json({
          message: "Internal server error",
        });
      }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
    
        // Create JWT token
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "12h",
          }
        );
    
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Set secure flag in production
          maxAge: 3600000, // Token expiration time (1 hour)
        });
    
        return res.status(200).json({
          message: "Sign in successful",
          token,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      }

}

 async function logout(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.status(200).json({
        message: "Successfully logged out",
      });
}

module.exports = {
    signup,
    login,
    logout
  };