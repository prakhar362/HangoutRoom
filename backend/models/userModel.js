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


module.exports = { userModel };