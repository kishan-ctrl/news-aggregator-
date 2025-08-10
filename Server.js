require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/auth");





const app = express();
app.use(express.json());
app.use(cors());
app.use("/auth",authRoutes);
const articleRoutes = require('./routes/articles');
app.use('/articles', articleRoutes);


const { init } = require('./sockets/socket');


const server = http.createServer(app);
const io = init(server);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});


const PORT = process.env.PORT || 5000;
const start = async()=>{
    await connectDB();
    server.listen(PORT,()=>console.log(`server listening on Port ${PORT}`));

};

start();
const cron = require('node-cron');
const fetchArticles = require('./jobs/fetchArticles');

// Every 5 minutes: '*/5 * * * *'
// You can change the schedule as needed
cron.schedule('* * * * *', () => {
  console.log('Running scheduled article fetch...');
  fetchArticles();
});

