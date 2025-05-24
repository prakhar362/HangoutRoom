import React, { useEffect, useState } from "react";
import Sidebar from '@/components/Sidebar'
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Character from "../../Models/Character";
import { Room } from "../../Models/Room.jsx";
import useSocket from "../../hooks/useSocket.jsx";
import { OtherCharacter } from "../../Models/OtherCharacter.jsx";
import Gallery from "../../Models/Gallery.jsx";
import { useNavigate, useParams } from "react-router-dom";

function Homepage({ children }) {
  const [currentRoom, setCurrentRoom] = useState("main");
  const { socket, players, changeRoom } = useSocket("http://localhost:3000");
  const { groupId } = useParams();
  const navigate = useNavigate();
  
  const myRooms = ["main", "movieRoom", "movieRoom2"];

  useEffect(() => {
    if (socket) {
      changeRoom(currentRoom, groupId);
    }
  }, [currentRoom, socket, groupId]);

  const rooms = {
    main: <Gallery />,
    movieRoom: <Room />,
    movieRoom2: <Room />,
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-50">
        <Sidebar />
      </div>

      {/* Room Selection Cards */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex space-x-4 bg-black/50 p-2 rounded-lg backdrop-blur-sm">
          {myRooms.map((room) => (
            <button
              key={room}
              onClick={() => setCurrentRoom(room)}
              className={`px-4 py-2 rounded ${
                currentRoom === room 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-800 text-gray-200 hover:bg-gray-700"
              } transition-colors duration-200`}
            >
              {room}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas - Full Screen */}
      <div className="w-full h-full">
        <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight intensity={1} />
          <directionalLight position={[0, 10, 0]} intensity={1} />
          {rooms[currentRoom]}

          {socket && players && Object.keys(players)
            .filter(
              (playerId) =>
                playerId !== socket.id &&
                players[playerId]?.room === players[socket.id]?.room &&
                players[playerId]?.group === players[socket.id]?.group
            )
            .map((playerId) => (
              <OtherCharacter
                key={playerId}
                playerId={playerId}
                players={players}
                socket={socket}
                currentRoom={currentRoom}
                currentGroup={groupId}
              />
            ))}

          {socket && (
            <Character
              playerId={socket.id}
              players={players}
              currentRoom={currentRoom}
              socket={socket}
            />
          )}
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={0}
            target={[0, 0, 0]}
            makeDefault
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={1}
            panSpeed={1}
            mouseButtons={{
              LEFT: 1,
              MIDDLE: 2,
              RIGHT: 0
            }}
            touches={{
              ONE: 1,
              TWO: 2
            }}
          />
        </Canvas>
      </div>
    </div>
  )
}

export default Homepage