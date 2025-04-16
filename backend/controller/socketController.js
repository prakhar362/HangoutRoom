// controllers/socketController.js
const rooms = {};
const players = {};

const handlePlayerJoin = (socket, group, room, peerId) => {
  players[socket.id] = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    room,
    group,
    peerId
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
  const room = players[socket.id].room;
  const group = players[socket.id].group;
  const currentRoom = `${group}-${room}`;

  if (position && rotation) {
    players[socket.id].position = position;
    players[socket.id].rotation = rotation;
    players[socket.id].isMoving = isMoving;

    if (rooms[currentRoom]) {
      io.to(currentRoom).emit("player-update", Array.from(rooms[currentRoom]).map(id => players[id]));
    }
  }
};

const handleChangeRoom = (socket, newRoom, newGroup) => {
  const oldRoom = players[socket.id]?.room;
  const oldGroup = players[socket.id]?.group;
  const currentRoom = `${oldGroup}-${oldRoom}`;

  socket.leave(currentRoom);
  rooms[currentRoom]?.delete(socket.id);

  players[socket.id].room = newRoom;
  players[socket.id].group = newGroup;

  const newRoomKey = `${newGroup}-${newRoom}`;
  if (!rooms[newRoomKey]) rooms[newRoomKey] = new Set();

  rooms[newRoomKey].add(socket.id);
  socket.join(newRoomKey);
  
  io.to(newRoomKey).emit("player-update", Array.from(rooms[newRoomKey]).map(id => players[id]));
};

module.exports = {
  handlePlayerJoin,
  handlePlayerMove,
  handleChangeRoom
};
