import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Create HTTP server using Express app
const server = http.createServer(app);

// Initialize Socket.io with CORS enabled
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for this PoC
        methods: ["GET", "POST"]
    }
});

// Interface to define the structure of a user
interface User {
    id: string;
    username: string;
}

// Store connected users. Key is socket ID, value is username.
// In a real app, this might be a database or Redis.
const users: Record<string, string> = {};

// Socket.io connection handler
io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Event listener for when a user joins the chat
    socket.on('join', (username: string) => {
        // Store the username associated with the socket ID
        users[socket.id] = username;
        console.log(`User joined: ${username} (${socket.id})`);

        // Broadcast to all clients that a new user has joined
        io.emit('message', {
            user: 'System',
            text: `${username} has joined the chat.`
        });
    });

    // Event listener for chat messages
    socket.on('message', (message: string) => {
        const username = users[socket.id];
        if (username) {
            console.log(`Message from ${username}: ${message}`);
            // Broadcast the message to all connected clients
            io.emit('message', {
                user: username,
                text: message
            });
        }
    });

    // Event listener for disconnection
    socket.on('disconnect', () => {
        const username = users[socket.id];
        if (username) {
            console.log(`User disconnected: ${username} (${socket.id})`);
            // Broadcast to all clients that the user has left
            io.emit('message', {
                user: 'System',
                text: `${username} has left the chat.`
            });
            // Remove the user from the store
            delete users[socket.id];
        } else {
            console.log(`User disconnected: ${socket.id}`);
        }
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export { server, io };
