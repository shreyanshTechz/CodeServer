const express = require('express');
const app = express();
http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://collaborate-gules.vercel.app/',
    methods: ['GET', 'POST'],
  },
});
io.on('connection', (socket) => {
  console.log(`connected ${socket.id}`);
  socket.on('message', (evt) => {
      socket.broadcast.emit('message', evt)
  })
})
io.on('disconnect', (evt) => {
  log('some people left')
})

server.listen(4000, () => 'Server is running on port 3000');