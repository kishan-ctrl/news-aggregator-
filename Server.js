const express = require("express");
const http = require('http');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const fetchNewsJob = require('./jobs/fetchNews');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*', // For dev purposes, allow all
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.json());
connectDB();
fetchNewsJob(io); // ✅ pass socket.io instance into cron job

// Routes
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const authenticate = require("./middleware/auth");

app.use('/auth', authRoutes);
app.use('/articles', articleRoutes);

app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "You are Authorized", user: req.user });
});

// ✅ WebSocket setup
const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  // Listen for "register" event to associate user ID with socket
  socket.on('register', (userId) => {
    connectedUsers[userId] = socket.id;
    console.log(`✅ Registered user ${userId} with socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    for (const userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];
        break;
      }
    }
  });
});

// Expose connected users to cron job
app.set('connectedUsers', connectedUsers);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
