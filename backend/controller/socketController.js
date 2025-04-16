// controllers/socketController.js
const { rooms, players } = require('../models/gameState');

const handlePlayerJoin = (socket, group, room, peerId) => {
  players[socket.id] = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    room,
    group,
    peerId,
    username: `User${socket.id.slice(0, 4)}` // Add a default username
  };

  const currentRoom = `${group}-${room}`;
  
  if (!rooms[currentRoom]) {
    rooms[currentRoom] = new Set();
  }

  rooms[currentRoom].add(socket.id);
  socket.join(currentRoom);

  socket.emit("initial-data", { players, rooms });
  return currentRoom;
};

const handlePlayerMove = (socket, data) => {
  const { position, rotation, isMoving } = data;
  const room = players[socket.id]?.room;
  const group = players[socket.id]?.group;
  const currentRoom = `${group}-${room}`;

  if (position && rotation && players[socket.id]) {
    players[socket.id].position = position;
    players[socket.id].rotation = rotation;
    players[socket.id].isMoving = isMoving;

    if (rooms[currentRoom]) {
      socket.to(currentRoom).emit("player-update", Array.from(rooms[currentRoom]).map(id => players[id]));
    }
  }
};

const handleChangeRoom = (socket, newRoom, newGroup) => {
  const oldRoom = players[socket.id]?.room;
  const oldGroup = players[socket.id]?.group;
  const currentRoom = `${oldGroup}-${oldRoom}`;

  if (currentRoom && rooms[currentRoom]) {
    socket.leave(currentRoom);
    rooms[currentRoom].delete(socket.id);
    socket.to(currentRoom).emit("player-update", Array.from(rooms[currentRoom]).map(id => players[id]));
  }

  players[socket.id].room = newRoom;
  players[socket.id].group = newGroup;

  const newRoomKey = `${newGroup}-${newRoom}`;
  if (!rooms[newRoomKey]) {
    rooms[newRoomKey] = new Set();
  }

  rooms[newRoomKey].add(socket.id);
  socket.join(newRoomKey);
  
  socket.to(newRoomKey).emit("player-update", Array.from(rooms[newRoomKey]).map(id => players[id]));
};

const handleSendMessage = (socket, message) => {
  const room = players[socket.id]?.room;
  const group = players[socket.id]?.group;
  const currentRoom = `${group}-${room}`;

  if (currentRoom && rooms[currentRoom]) {
    const messageData = {
      message,
      user: socket.id,
      username: players[socket.id]?.username,
      timestamp: new Date().toISOString()
    };
    socket.to(currentRoom).emit('receiveMessage', messageData);
  }
};

const handleDisconnect = (socket) => {
  const room = players[socket.id]?.room;
  const group = players[socket.id]?.group;
  const currentRoom = `${group}-${room}`;

  if (currentRoom && rooms[currentRoom]) {
    rooms[currentRoom].delete(socket.id);
    socket.to(currentRoom).emit("player-update", Array.from(rooms[currentRoom]).map(id => players[id]));
  }
  delete players[socket.id];
};

module.exports = {
  handlePlayerJoin,
  handlePlayerMove,
  handleChangeRoom,
  handleSendMessage,
  handleDisconnect
};