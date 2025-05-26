import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import RoomManager from '@/components/RoomManager';

function Room() {
  const { roomName } = useParams();

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <main className="ml-0 p-6 pt-20">
        {!roomName ? (
          <RoomManager />
        ) : (
          <div>
            {/* Room content will be implemented here */}
            <h1>Room: {roomName}</h1>
          </div>
        )}
      </main>
    </div>
  );
}

export default Room;
