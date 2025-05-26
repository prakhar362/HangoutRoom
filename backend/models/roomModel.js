const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        isPermanent: {
            type: Boolean,
            default: false
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    activeUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    theme: {
        type: String,
        enum: ["Gallery", "Room"],
        default: "Room"
    },
    characterTheme: {
        type: String,
        enum: ["Character", "OtherCharacter"],
        default: "Character"
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        default: null
    }
});

const roomModel = mongoose.model("Room", roomSchema);

module.exports = { roomModel }; 