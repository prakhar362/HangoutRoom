// events/socketEvents.js
const { handlePlayerJoin, handlePlayerMove, handleChangeRoom, handleSendMessage, handleDisconnect } = require('../controller/socketController');

const setupSocketEvents = (socket, io) => {
  socket.on("join-room", ({ peerId, group, room }) => {
    const currentRoom = handlePlayerJoin(socket, group, room, peerId);
    socket.to(currentRoom).emit("peer-joined", { id: socket.id, peerId });
  });

  socket.on("move", (data) => {
    handlePlayerMove(socket, data);
  });

  socket.on("change-room", ({ newRoom, newGroup }) => {
    handleChangeRoom(socket, newRoom, newGroup);
  });

  socket.on("sendMessage", ({ message }) => {
    handleSendMessage(socket, message);
  });

  socket.on("disconnect", () => {
    handleDisconnect(socket);
    console.log(`User disconnected: ${socket.id}`);
  });
};

module.exports = setupSocketEvents;