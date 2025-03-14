"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.json());
// API Endpoint to Broadcast New Bids
const io = new socket_io_1.Server(server, {
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
