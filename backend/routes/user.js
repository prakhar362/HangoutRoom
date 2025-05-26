const { Router } = require("express");
const { login, logout, signup, profile, updateSettings } = require("../controller/authController");
const { createRoom, joinRoom, leaveRoom, getRoomDetails, getUserRooms } = require("../controller/roomController");
const auth = require("../middleware/auth");

const userRouter = Router();

// Auth routes
userRouter.get('/test', (req, res) => {
  res.json({ message: "user router testing done" });
});
userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/profile', auth, profile);
userRouter.put('/settings', auth, updateSettings);
userRouter.post('/logout', logout);

// Room routes (all require authentication)
userRouter.get('/rooms', auth, getUserRooms);
userRouter.post('/room/create', auth, createRoom);
userRouter.post('/room/join', auth, joinRoom);
userRouter.post('/room/leave', auth, leaveRoom);
userRouter.get('/room/:roomName', auth, getRoomDetails);

module.exports = { userRouter };
