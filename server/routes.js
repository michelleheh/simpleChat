const broadcastJoin = require('./utils').broadcastJoin;
const broadcastLeft = require('./utils').broadcastLeft;
const closeSocket = require('./utils').closeSocket;

const getUserName = function(socket, usernames, data, rooms) {
  if ( usernames[data] ) {
    socket.write('Sorry, name taken.\nLogin Name? \n');
  } else if ( data === '' ) { 
    socket.write('Name cannot be empty.\nLogin Name? \n');
  } else if ( data[0] === '/' ) { 
    socket.write('Invalid username.\nLogin Name? \n');
  } else {
    socket.name = data;
    usernames[data] = true;
    socket.write(`Welcome, ${socket.name}!\n`);
    getRoom(socket, rooms);
  }
};

const getRoom = (socket, rooms) => {
  // display room
  socket.write('Active rooms are:\n');
  Object.keys(rooms).forEach((room) => {
    socket.write(`* ${room} (${rooms[room].length})\n`);
  });
  socket.write('end of list.\n');
};

const joinRoom = function(socket, rooms, data, clients) {
  const room = data.split(' ')[1];
  if ( !rooms[room] ) { 
    socket.write('Room doesn\'t exist\n'); 
    getRoom(socket, rooms);
  } else {
    socket.room = room;
    rooms[room].push(socket);
    broadcastJoin(socket, room, clients);
    rooms[room].forEach((currentSocket) => {
      let data = `* ${currentSocket.name}`;
      if ( currentSocket === socket ) data += '(** this is you)\n'
      else data += '\n';
      socket.write(data);
    });

    rooms[room].forEach((client) => console.log(`currrently in the room ${room}: ${client.name}`));

    console.log(`${socket.name} joined ${room}`);
    console.log(`updated room users in ${room}: ${rooms[room].length}`);
    rooms[room].forEach((client) => console.log(client.name));
    socket.write('end of list.\n');
  }
};

const leaveRoom = function(socket, rooms, clients) {
  const room = socket.room;
  if ( !room ) {
    socket.write('You are not in a room yet!\n');
    getRoom(socket, rooms);
  } else {
    delete socket[room];
    rooms[room].splice(rooms[room].indexOf(socket), 1);
    broadcastLeft(socket, room, clients);

    console.log(`${socket.name} left ${room}`);
    console.log(`updated room users in ${room}: ${rooms[room].length}`);
    rooms[room].forEach((client) => console.log(client.name));
  }
};

const quit = function(socket, rooms, clients) {
  if ( socket.room ) leaveRoom(socket, rooms, clients);
  console.log(`${socket.name} closed connection!`);
  socket.write('BYE\n')
  closeSocket(socket, clients);
  socket.end();
};

module.exports = {
  getUserName,
  getRoom,
  joinRoom,
  leaveRoom,
  quit,
};