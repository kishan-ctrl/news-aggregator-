const jwt = require('jsonwebtoken');

module.exports = (io) => {
  // auth on socket handshake
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No token'));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.id;
      next();
    } catch (err) {
      next(new Error('Auth error'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(socket.userId.toString()); // user-specific room
    console.log('Socket connected', socket.userId);

    socket.on('disconnect', () => {
      console.log('Socket disconnected', socket.userId);
    });
  });

  return io;
};
