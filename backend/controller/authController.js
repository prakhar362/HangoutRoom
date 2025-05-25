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

async function profile(req, res) {
    try {
        console.log('Profile request received for user:', req.user);
        const userId = req.user.id;
        
        if (!userId) {
            console.error('No user ID found in request');
            return res.status(401).json({
                message: "User ID not found in token"
            });
        }

        console.log('Looking up user with ID:', userId);
        
        const user = await userModel.findById(userId)
            .select('-password')
            .lean();
        
        if (!user) {
            console.error('User not found for ID:', userId);
            return res.status(404).json({
                message: "User not found"
            });
        }

        console.log('User found:', {
            id: user._id,
            name: user.userName,
            email: user.email
        });

        // Prepare the response with default values
        const response = {
            message: "Profile details retrieved successfully",
            user: {
                name: user.userName,
                email: user.email,
                currentAvatar: user.currentAvatar || "default-avatar.png",
                previousAvatars: user.previousAvatars || [],
                themeSettings: user.themeSettings || {
                    darkMode: false,
                    accentColor: "#000000"
                },
                joinedGroups: [], // Initialize as empty array
                groupsMessage: "Not part of any groups yet"
            }
        };

        res.status(200).json(response);
    } catch (err) {
        console.error('Profile error:', err);
        res.status(500).json({
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
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

async function updateSettings(req, res) {
    try {
        const userId = req.user.id;
        const { email, password, themeSettings, characterSettings } = req.body;

        // Validate user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prepare update object
        const updateData = {};

        // Update email if provided
        if (email && email !== user.email) {
            // Check if email is already taken
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use" });
            }
            updateData.email = email;
        }

        // Update password if provided
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters long" });
            }
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Update theme settings if provided
        if (themeSettings) {
            updateData.themeSettings = {
                ...user.themeSettings,
                ...themeSettings
            };
        }

        // Update character settings if provided
        if (characterSettings) {
            updateData.characterSettings = {
                ...user.characterSettings,
                ...characterSettings
            };
        }

        // If no updates provided
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No updates provided" });
        }

        // Update user
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, select: '-password' }
        );

        res.status(200).json({
            message: "Settings updated successfully",
            user: {
                email: updatedUser.email,
                themeSettings: updatedUser.themeSettings,
                characterSettings: updatedUser.characterSettings
            }
        });

    } catch (err) {
        console.error('Settings update error:', err);
        res.status(500).json({
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

module.exports = {
    signup,
    login,
    logout,
    profile,
    updateSettings
};