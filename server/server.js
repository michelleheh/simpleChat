const net = require('net');

const chat = require('./config')

const chatServer = net.createServer(chat);

chatServer.listen(9399, () => {
  console.log('Lobby listening on 9399');
});

