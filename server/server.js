import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './connectToDb/db.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js'; // Assuming you'll add routes for chat history
import cors from 'cors';
import Chat from './models/chat.js'; // Import the Chat model for saving messages
import emailRoutes from "./routes/emailRoutes.js";

const app = express();
const httpServer = createServer(app);

// Set up Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: 'https://tution.onrender.com', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the methods you want to allow
    credentials: true, // Enable credentials if needed
  },
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://tution.onrender.com', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Connect to the database
connectDB();

// Routes

// Handle socket connections for real-time chat
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    const chatMessage = new Chat({ senderId, receiverId, message });
    await chatMessage.save(); // Save the message to MongoDB
    
    // Send message to the receiver
    io.emit('receiveMessage', { senderId, receiverId, message });
  });
  app.use('/api/users', userRoutes); // Existing user routes
  app.use('/api/chats', chatRoutes);  // Chat routes for chat history
  app.use("/api/email", emailRoutes);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Chat routes for fetching chat history


// Set the port
const PORT = process.env.PORT || 5000;

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
