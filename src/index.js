const mineflayer = require("mineflayer");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

module.exports = function(bot, options) {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);

  app.use(express.static(__dirname + '/public'));

  io.on('connection', (socket) => {
    console.log('[webConsole] A user connected to the Web console');

    socket.emit('update_players', bot.players);

    bot.on('playerJoined', () => {
      io.emit('update_players', bot.players);
    });

    bot.on('playerLeft', () => {
      io.emit('update_players', bot.players);
    });

    bot.on('message', (message) => {
      socket.emit('bot_message', { message: message.toAnsi() });
    });

    socket.on('user_message', (data) => {
      const userMessage = data.message;
      console.log(`Message from user: ${userMessage}`);
      bot.sendMessage('local', userMessage);
    });

    socket.on('disconnect', () => {
      console.log('[webConsole] A user disconnected from the Web console');
    });
  });

  const port = options.port || 3000;
  server.listen(port, () => {
    console.log(`[WebConsolePlugin] Server is running on http://localhost:${port}`);
  });
};