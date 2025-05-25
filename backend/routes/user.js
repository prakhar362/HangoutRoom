const { Router } = require("express");
const { login, logout, signup, profile, updateSettings } = require("../controller/authController");
const auth = require("../middleware/auth");

const userRouter = Router();

userRouter.get('/test', (req, res) => {
  res.json({ message: "user router testing done" });
});
userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/profile', auth, profile);
userRouter.put('/settings', auth, updateSettings);
userRouter.post('/logout', logout);

module.exports = { userRouter };
