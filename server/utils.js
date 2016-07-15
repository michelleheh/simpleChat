const broadcast = (socket, room, data, clients) => {
  clients.forEach((currentSocket) => {
    if ( currentSocket !== socket ) currentSocket.write(`${socket.name}: ${data}\n`);
  });
};

const broadcastJoin = (socket, room, clients) => {
  clients.forEach((currentSocket) => {
    if ( currentSocket.room === room) currentSocket.write(`${socket.name} joined ${room}!\n`);
  });
};

const broadcastLeft = (socket, room, clients) => {
  clients.forEach((currentSocket) => {
    if ( currentSocket.room === room) currentSocket.write(`${socket.name} left ${room}!\n`);
  });
};

const closeSocket = (socket, clients) => {
  const i = clients.indexOf(socket);
  if ( i !== -1) clients.splice(i, 1);
};

module.exports = {
  broadcast,
  broadcastJoin,
  broadcastLeft,
  closeSocket,
};