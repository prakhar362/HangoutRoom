const express = require('express');
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const { userRouter } = require('./routes/user');
const setupSocketEvents = require("./routes/socketEvents");

const app = express();
// Create HTTP server for Express
const server = http.createServer(app);

// Middleware to parse JSON requests
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello from server!!');
});

app.use("/api/v1/user", userRouter);

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Your frontend URL (adjust as needed)
        methods: ["GET", "POST"],
    },
});

// Socket.IO Event Handling (basic)
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    setupSocketEvents(socket, io);
});

// Server execution code below
const port = process.env.PORT || 3000;
async function main() {
    try {
        // Using dotenv for MongoDB URL
        const mongourl = process.env.MONGO_URL;
        await mongoose.connect(mongourl);

        // If successful
        console.log('MongoDB successfully Connected');
        server.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit the process if the DB connection fails
    }
}

main();
