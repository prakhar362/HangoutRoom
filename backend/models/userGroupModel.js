const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userGroupSchema = new Schema({
    groupName: {
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
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    themeImage: {
        type: String,
        default: "default-group-theme.png"
    }
});

const userGroupModel = mongoose.model("UserGroup", userGroupSchema);

module.exports = { userGroupModel };