const express=require('express');
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const {userRouter}=require('./routes/user')

const app=express();

//middleware to pasrse JSON requests
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Hello from server!!')
});

app.use("/api/v1/user", userRouter);

const port= 3000 || process.env.PORT;
async function main()
{
    try{
        //using dotenv
        const mongourl=process.env.MONGO_URL;
        await mongoose.connect(mongourl);

        //if done successuflly
        console.log('MongoDB successfully Connected');
        app.listen(port, ()=>{
            console.log(`Server running on http://localhost:${port}`);
        })
    }

    catch(error){
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit the process if the DB connection fails
    }
}

main();