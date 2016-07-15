const routes = require('./routes');
const broadcast = require('./utils').broadcast;
const closeSocket = require('./utils').closeSocket;

let clients = [];
let rooms = {chat: [], hottub: []};
let usernames = {gc: true}; // defaul user gc is taken

const chat = (socket) => {
  clients.push(socket);
  socket.write('Welcome to the Michelle\'s chatting service!\nLogin Name? \n');

  // socket routes
  socket.on('data', (data) => {
    
    data = ('' + data).trim();
    // get user name
    if ( !socket.name ) routes.getUserName(socket, usernames, data, rooms);
    // get chatrooms
    else if (data === '/rooms') routes.getRoom(socket, rooms);
    // join chat room
    else if ( data.indexOf('/join') === 0 ) routes.joinRoom(socket, rooms, data, clients);
    // leaving chat room
    else if (data === '/leave') routes.leaveRoom(socket, rooms, clients)
    // end socket connection
    else if (data === '/quit') routes.quit(socket, clients);
    // conversation
    else broadcast(socket, socket.room, data, clients)

  });
  socket.on('error', (err) => {
    console.log(err);
  });
  socket.on('end', () => closeSocket(socket, clients));
};

module.exports = chat;