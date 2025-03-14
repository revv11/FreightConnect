import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(express.json());

// API Endpoint to Broadcast New Bids
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    
    // Listen for truckers joining a job bid room
    socket.on("joinBidRoom", (jobId) => {
        socket.join(jobId);
        console.log(`Socket ${socket.id} joined room: ${jobId}`);
    });
    
    // Broadcast new bids
    socket.on("newBid", ({ jobId, bid }) => {
        io.to(jobId).emit("bidUpdate", bid);
    });
    
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`WebSocket Server running on port ${PORT}`);
});
app.post("/broadcast", (req, res) => {
  const { jobId, newbid } = req.body;
  io.to(jobId).emit("bidUpdate", newbid);
  res.status(200).send("Broadcasted successfully");
});