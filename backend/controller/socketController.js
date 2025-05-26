// controllers/socketController.js
const { roomModel } = require('../models/roomModel');
const { userModel } = require('../models/userModel');
const { userGroupModel } = require('../models/userGroupModel');

// Store active users and their positions
const activeUsers = new Map();

function handlePlayerJoin(socket, group, room, peerId) {
    const currentRoom = `${group}/${room}`;
    
    // Add user to active users map
    activeUsers.set(socket.id, {
        peerId,
        room: currentRoom,
        position: { x: 0, y: 0 },
        userId: socket.request.user.id // Store MongoDB user ID
    });

    // Join socket room
    socket.join(currentRoom);

    // Get room details and emit current users
    userGroupModel.findOne({ groupName: room })
        .then(roomData => {
            if (roomData) {
                // Emit current active users in room (those in activeUsers map)
                const usersInRoom = Array.from(activeUsers.entries())
                    .filter(([_, user]) => user.room === currentRoom)
                    .map(([id, user]) => ({
                        id,
                        peerId: user.peerId,
                        position: user.position,
                        // Optionally fetch more user details here if needed
                    }));

                socket.emit('room-users', usersInRoom);

                // Notify others in the room about the new peer
                 socket.to(currentRoom).emit("peer-joined", { id: socket.id, peerId });

                 // Add user to activeUsers in DB if not already there (handle disconnect/reconnect)
                 if (!roomData.activeUsers.includes(activeUsers.get(socket.id).userId)) {
                     roomData.activeUsers.push(activeUsers.get(socket.id).userId);
                     roomData.save().catch(err => console.error('Error updating active users on join:', err));
                 }

            }
        })
        .catch(err => console.error('Error finding room on join:', err));

    return currentRoom;
}

function handlePlayerMove(socket, data) {
    const user = activeUsers.get(socket.id);
    if (user) {
        // Update user position
        user.position = data.position;
        
        // Broadcast movement to other users in the same room
        socket.to(user.room).emit('player-moved', {
            id: socket.id,
            position: data.position
        });
    }
}

function handleChangeRoom(socket, newRoom, newGroup) {
    const user = activeUsers.get(socket.id);
    if (user) {
        // Leave current room
        socket.leave(user.room);
        
        // Update user's room
        user.room = `${newGroup}/${newRoom}`;
        
        // Join new room
        socket.join(user.room);
        
        // Reset position
        user.position = { x: 0, y: 0 };
        
        // Notify room change
        socket.emit('room-changed', {
            room: user.room,
            position: user.position
        });

        // Update active users in DB (remove from old room, add to new)
        const [oldGroup, oldRoomName] = user.room.split('/');
        userGroupModel.findOne({ groupName: oldRoomName })
            .then(oldRoomData => {
                if (oldRoomData) {
                    oldRoomData.activeUsers = oldRoomData.activeUsers.filter(
                        userId => userId.toString() !== user.userId
                    );
                    return oldRoomData.save();
                }
            })
            .then(() => userGroupModel.findOne({ groupName: newRoom }))
            .then(newRoomData => {
                if (newRoomData && !newRoomData.activeUsers.includes(user.userId)) {
                     newRoomData.activeUsers.push(user.userId);
                     return newRoomData.save();
                }
                return null; // Or handle case where new room not found
            })
            .catch(err => console.error('Error updating active users on change room:', err));

    }
}

function handleSendMessage(socket, message) {
    const user = activeUsers.get(socket.id);
    if (user) {
        // Broadcast message to room
        // We should ideally get the username from the userModel based on user.userId
        // For simplicity now, just using socket.id
        socket.to(user.room).emit('new-message', {
            id: socket.id, // Replace with username later
            message,
            timestamp: new Date()
        });
    }
}

function handleLeaveRoom(socket, roomName) {
    const user = activeUsers.get(socket.id);
    if (user && user.room.endsWith(`/${roomName}`)) { // Ensure user is in the room they are trying to leave
        const currentRoom = user.room;

        // Notify room that user has left
        socket.to(currentRoom).emit('user-left', {
            id: socket.id
        });

        // Remove user from active users map
        activeUsers.delete(socket.id);

        // Remove user from socket room
        socket.leave(currentRoom);

        // Update room's active users in database
        userGroupModel.findOne({ groupName: roomName })
            .then(roomData => {
                if (roomData) {
                    roomData.activeUsers = roomData.activeUsers.filter(
                        userId => userId.toString() !== user.userId
                    );
                    // Do NOT remove from roomData.members here based on current userGroupModel structure
                    return roomData.save();
                }
            })
            .catch(err => console.error('Error updating room on leave:', err));

        console.log(`User ${socket.id} left room: ${currentRoom}`);

    }
}

function handleDisconnect(socket) {
    const user = activeUsers.get(socket.id);
    if (user) {
        const currentRoom = user.room;

        // Notify room that user has disconnected
         socket.to(currentRoom).emit('user-left', {
            id: socket.id
        });

        // Remove user from active users map
        activeUsers.delete(socket.id);

        // Update room's active users in database
         userGroupModel.findOne({ groupName: currentRoom.split('/')[1] })
            .then(roomData => {
                if (roomData) {
                    roomData.activeUsers = roomData.activeUsers.filter(
                        userId => userId.toString() !== user.userId
                    );
                    // Do NOT remove from roomData.members here either
                    return roomData.save();
                }
            })
            .catch(err => console.error('Error updating room on disconnect:', err));

        console.log(`User disconnected: ${socket.id}`);
    }
}

module.exports = {
    handlePlayerJoin,
    handlePlayerMove,
    handleChangeRoom,
    handleSendMessage,
    handleDisconnect,
    handleLeaveRoom
};