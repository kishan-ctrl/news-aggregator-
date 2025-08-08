const express = require("express");
const http = require('http');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const fetchNewsJob = require('./jobs/fetchNews'); // we’ll update this to handle io + email
const cron = require('node-cron');

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

// Routes
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const authenticate = require("./middleware/auth");

app.use('/auth', authRoutes);
app.use('/articles', articleRoutes);

app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "You are Authorized", user: req.user });
});

// Track connected users (userId → socketId)
const connectedUsers = {};
app.set('connectedUsers', connectedUsers);

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('register', (userId) => {
    connectedUsers[userId] = socket.id;
    console.log(`Registered user ${userId} with socket ${socket.id}`);
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

// Run the news fetch job every minute
cron.schedule('* * * * *', () => {
  fetchNewsJob(io, connectedUsers);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
