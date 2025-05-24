import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = (serverUrl) => {
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState({});
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const newSocket = io(serverUrl);
    setSocket(newSocket);

    newSocket.on('players', (playersData) => {
      setPlayers(playersData);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [serverUrl]);

  const changeRoom = (room, groupId = group) => {
    if (socket) {
      socket.emit('changeRoom', { room, group: groupId });
    }
  };

  return {
    socket,
    players,
    changeRoom,
    group,
    setGroup
  };
};

export default useSocket; 