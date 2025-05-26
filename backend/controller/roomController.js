const { userGroupModel } = require("../models/userGroupModel");
const { userModel } = require("../models/userModel");
const zod = require("zod");

// Validation schemas
const createRoomSchema = zod.object({
    roomName: zod.string().min(3, "Room name must be at least 3 characters"),
    description: zod.string().optional(),
    isPrivate: zod.boolean().optional(),
    password: zod.string().optional(),
    theme: zod.enum(["Gallery", "Room"]).optional(),
    characterTheme: zod.enum(["Character", "OtherCharacter"]).optional()
});

const joinRoomSchema = zod.object({
    joinCode: zod.string().length(4, "Join code must be exactly 4 characters"),
    isPermanent: zod.boolean().optional()
});

// Generate a unique 4-digit join code
async function generateUniqueJoinCode() {
    while (true) {
        const code = Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 4-digit number
        const existingRoom = await userGroupModel.findOne({ joinCode: code });
        if (!existingRoom) {
            return code;
        }
    }
}

// Create a new room
async function createRoom(req, res) {
    try {
        const userId = req.user.id;
        const roomData = createRoomSchema.parse(req.body);

        // Check if room name already exists
        const existingRoom = await userGroupModel.findOne({ groupName: roomData.roomName });
        if (existingRoom) {
            return res.status(400).json({ message: "Room name already exists" });
        }

        // Generate unique join code
        const joinCode = await generateUniqueJoinCode();

        // Create new room
        const newRoom = await userGroupModel.create({
            groupName: roomData.roomName,
            description: roomData.description || "",
            members: [userId],
            themeImage: roomData.theme === "Gallery" ? "gallery-theme.png" : "room-theme.png",
            joinCode: joinCode
        });

        res.status(201).json({
            message: "Room created successfully",
            room: newRoom,
            joinCode: joinCode // Send the join code back to the creator
        });
    } catch (err) {
        if (err instanceof zod.ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: err.errors
            });
        }
        console.error('Create room error:', err);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Join an existing room
async function joinRoom(req, res) {
    try {
        const userId = req.user.id;
        const { joinCode, isPermanent = false } = joinRoomSchema.parse(req.body);

        // Find the room by join code
        const room = await userGroupModel.findOne({ joinCode });
        if (!room) {
            return res.status(404).json({ message: "Invalid join code" });
        }

        // Check if user is already a member
        if (!room.members.includes(userId)) {
            // Add user as new member
            room.members.push(userId);
            await room.save();
        }

        res.status(200).json({
            message: "Successfully joined room",
            room
        });
    } catch (err) {
        if (err instanceof zod.ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: err.errors
            });
        }
        console.error('Join room error:', err);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Leave room
async function leaveRoom(req, res) {
    try {
        const userId = req.user.id;
        const { roomName } = req.body;

        const room = await userGroupModel.findOne({ groupName: roomName });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Remove user from members
        room.members = room.members.filter(id => id.toString() !== userId);
        await room.save();

        res.status(200).json({
            message: "Successfully left room"
        });
    } catch (err) {
        console.error('Leave room error:', err);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get room details
async function getRoomDetails(req, res) {
    try {
        const { roomName } = req.params;
        const room = await userGroupModel.findOne({ groupName: roomName })
            .populate('members', 'userName email currentAvatar');

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json({
            room
        });
    } catch (err) {
        console.error('Get room details error:', err);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get user's rooms
async function getUserRooms(req, res) {
    try {
        const userId = req.user.id;
        
        const rooms = await userGroupModel.find({ members: userId })
            .populate('members', 'userName email currentAvatar')
            .sort({ createdAt: -1 });

        res.status(200).json({
            rooms
        });
    } catch (err) {
        console.error('Get user rooms error:', err);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createRoom,
    joinRoom,
    leaveRoom,
    getRoomDetails,
    getUserRooms
}; 