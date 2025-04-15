const { Router } = require("express");
const { login, logout, signup } = require("../controller/authController");

const userRouter = Router();

userRouter.get('/test', (req, res) => {
  res.json({ message: "user router testing done" });
});
userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/logout', logout);

module.exports = { userRouter };
