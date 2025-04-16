// events/socketEvents.js
const { handlePlayerJoin, handlePlayerMove, handleChangeRoom } = require('../controller/socketController');

const setupSocketEvents = (socket, io) => {
  socket.on("join-room", ({ peerId, group, room }) => {
    const currentRoom = handlePlayerJoin(socket, group, room, peerId);
    io.to(currentRoom).emit("peer-joined", { id: socket.id, peerId });
  });

  socket.on("move", (data) => {
    handlePlayerMove(socket, data);
  });

  socket.on("change-room", ({ newRoom, newGroup }) => {
    handleChangeRoom(socket, newRoom, newGroup);
  });

  socket.on("sendMessage", ({ message }) => {
    io.to(`${players[socket.id].group}-${players[socket.id].room}`).emit('receiveMessage', { message, user: socket.id });
  });

  socket.on("disconnect", () => {
    const room = players[socket.id]?.room;
    const group = players[socket.id]?.group;
    const currentRoom = `${group}-${room}`;

    if (rooms[currentRoom]) {
      rooms[currentRoom].delete(socket.id);
      io.to(currentRoom).emit("player-update", Array.from(rooms[currentRoom]).map(id => players[id]));
    }
    delete players[socket.id];
    console.log(`User disconnected: ${socket.id}`);
  });
};

module.exports = setupSocketEvents;
