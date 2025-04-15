const { Router } = require("express");
const bcrypt = require("bcrypt");
const zod = require("zod");
const { userModel } = require('../models/userModel');
const jwt = require("jsonwebtoken");

const userRouter = Router();

userRouter.get('/test',(req,res)=>{
    res.json({
        message: "user router  testing done"
    });
})


module.exports={
    userRouter
}