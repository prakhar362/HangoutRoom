const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const users = new Schema({
    email: { type: String, unique: true },
    password: String,
    userName: { type: String, required: true },
    currentAvatar: {
        type: String,
        default: "default-avatar.png"
    },
    previousAvatars: [{
        type: String
    }],
    themeSettings: {
        homeTheme: {
            type: String,
            enum: ['light', 'dark', 'minimal'],
            default: 'light'
        },
        characterTheme: {
            type: String,
            enum: ['classic', 'modern', 'cartoon'],
            default: 'classic'
        },
        accentColor: {
            type: String,
            default: "#000000"
        },
        darkMode: {
            type: Boolean,
            default: false
        }
    },
    characterSettings: {
        model: {
            type: String,
            default: "default-character.glb"
        },
        animations: {
            type: [String],
            default: ["idle", "walk", "run"]
        },
        customizations: {
            type: Map,
            of: Schema.Types.Mixed,
            default: {}
        }
    },
    language: {
        type: String,
        enum: ['en', 'es', 'fr', 'de', 'hi'],
        default: 'en'
    },
    joinedGroups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserGroup"
    }]
});

const userModel = mongoose.model("User", users);

// Create a dummy user with some groups
const createDummyUser = async () => {
    try {
        const { userGroupModel } = require('./userGroupModel');
        
        // Get some group IDs
        const groups = await userGroupModel.find().limit(2);
        const groupIds = groups.map(group => group._id);

        // Check if dummy user exists
        const existingUser = await userModel.findOne({ email: "test@example.com" });
        if (!existingUser) {
            await userModel.create({
                email: "test@example.com",
                password: "hashedPassword123", // In real app, this should be hashed
                userName: "TestUser",
                currentAvatar: "avatar1.png",
                previousAvatars: ["old-avatar1.png", "old-avatar2.png"],
                themeSettings: {
                    darkMode: true,
                    accentColor: "#4A90E2"
                },
                joinedGroups: groupIds
            });
            console.log("Dummy user created successfully");
        }
    } catch (error) {
        console.error("Error creating dummy user:", error);
    }
};

// Call the function to create dummy user
createDummyUser();

module.exports = { userModel };