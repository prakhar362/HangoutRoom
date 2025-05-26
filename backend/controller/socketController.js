// controllers/socketController.js
const { roomModel } = require('../models/roomModel');
const { userModel } = require('../models/userModel');

// Store active users and their positions
const activeUsers = new Map();

function handlePlayerJoin(socket, group, room, peerId) {
    const currentRoom = `${group}/${room}`;
    
    // Add user to active users map
    activeUsers.set(socket.id, {
        peerId,
        room: currentRoom,
        position: { x: 0, y: 0 }
    });

    // Join socket room
    socket.join(currentRoom);

    // Get room details
    roomModel.findOne({ roomName: room })
        .then(roomData => {
            if (roomData) {
                // Emit current users in room
                const usersInRoom = Array.from(activeUsers.entries())
                    .filter(([_, user]) => user.room === currentRoom)
                    .map(([id, user]) => ({
                        id,
                        peerId: user.peerId,
                        position: user.position
                    }));

                socket.emit('room-users', usersInRoom);
            }
        })
        .catch(err => console.error('Error finding room:', err));

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
    }
}

function handleSendMessage(socket, message) {
    const user = activeUsers.get(socket.id);
    if (user) {
        // Broadcast message to room
        socket.to(user.room).emit('new-message', {
            id: socket.id,
            message,
            timestamp: new Date()
        });
    }
}

function handleDisconnect(socket) {
    const user = activeUsers.get(socket.id);
    if (user) {
        // Notify room that user has left
        socket.to(user.room).emit('user-left', {
            id: socket.id
        });

        // Remove user from active users
        activeUsers.delete(socket.id);

        // Update room's active users in database
        const [group, room] = user.room.split('/');
        roomModel.findOne({ roomName: room })
            .then(roomData => {
                if (roomData) {
                    roomData.activeUsers = roomData.activeUsers.filter(
                        userId => userId.toString() !== socket.id
                    );
                    return roomData.save();
                }
            })
            .catch(err => console.error('Error updating room:', err));
    }
}

module.exports = {
    handlePlayerJoin,
    handlePlayerMove,
    handleChangeRoom,
    handleSendMessage,
    handleDisconnect
};