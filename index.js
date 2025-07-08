const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Compter les utilisateurs connectés
  const connectedUsers = io.engine.clientsCount;
  console.log(`Users connected: ${connectedUsers}`);
  
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    // Envoyer le message à tous les clients sauf l'expéditeur
    socket.broadcast.emit('chat message', msg);
  });
  
  socket.on('typing', (isTyping) => {
    // Informer les autres utilisateurs que quelqu'un tape
    socket.broadcast.emit('user typing', isTyping);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    const remainingUsers = io.engine.clientsCount;
    console.log(`Users remaining: ${remainingUsers}`);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});