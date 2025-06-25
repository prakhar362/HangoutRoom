import React, { useEffect, useState, Suspense, useCallback } from "react";
import Sidebar from '@/components/Sidebar';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import Character from "../../Models/Character";
import { Room } from "../../Models/Room.jsx";
import useSocket from "../../hooks/useSocket.jsx";
import { OtherCharacter } from "../../Models/OtherCharacter.jsx";
import Gallery from "../../Models/Gallery.jsx";
import { useNavigate, useParams } from "react-router-dom";
import * as THREE from 'three';

function Homepage({ children }) {
  const [currentRoom, setCurrentRoom] = useState("main");
  const [movementKeys, setMovementKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
  });
  const { socket, players, changeRoom } = useSocket("http://localhost:3000");
  const { groupId } = useParams();
  const navigate = useNavigate();
  
  const myRooms = [
    { id: "main", name: "Main Hall", icon: "🏛️" },
    { id: "movieRoom", name: "Movie Room", icon: "🎬" },
    { id: "movieRoom2", name: "Lounge", icon: "🛋️" },
  ];

  // Room configurations
  const roomConfigs = {
    main: {
      camera: { position: [0, 3, 5], fov: 60 },
      lighting: {
        ambient: { intensity: 0.5 },
        directional: { position: [10, 10, 5], intensity: 1 },
      },
      roomScale: 1,
    },
    movieRoom: {
      camera: { position: [0, 2, 4], fov: 70 },
      lighting: {
        ambient: { intensity: 0.3 },
        directional: { position: [5, 10, 5], intensity: 0.8 },
      },
      roomScale: 0.8,
    },
    movieRoom2: {
      camera: { position: [0, 2, 4], fov: 70 },
      lighting: {
        ambient: { intensity: 0.4 },
        directional: { position: [5, 10, 5], intensity: 0.9 },
      },
      roomScale: 0.8,
    },
  };

  const currentConfig = roomConfigs[currentRoom] || roomConfigs.main;

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase();
    if (['w', 'a', 's', 'd'].includes(key)) {
      setMovementKeys(prev => ({
        ...prev,
        [key]: true
      }));
    }
  }, []);

  const handleKeyUp = useCallback((e) => {
    const key = e.key.toLowerCase();
    if (['w', 'a', 's', 'd'].includes(key)) {
      setMovementKeys(prev => ({
        ...prev,
        [key]: false
      }));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (socket) {
      changeRoom(currentRoom, groupId);
    }
  }, [currentRoom, socket, groupId]);

  const rooms = {
    main: <Gallery scale={currentConfig.roomScale} />,
    movieRoom: <Room scale={currentConfig.roomScale} />,
    movieRoom2: <Room scale={currentConfig.roomScale} />,
  };

  return (
    <div className="fixed inset-0 bg-gray-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-50">
        <Sidebar />
      </div>

      {/* Room Selection Cards */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex space-x-2 bg-black/70 p-2 rounded-xl backdrop-blur-sm border border-gray-700 shadow-2xl">
          {myRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setCurrentRoom(room.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                currentRoom === room.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800/80 text-gray-200 hover:bg-gray-700"
              }`}
            >
              <span className="text-xl">{room.icon}</span>
              <span className="font-medium">{room.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Player Count Badge */}
      {socket && players && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-gray-700">
          {Object.values(players).filter(p => p.room === currentRoom).length} {Object.values(players).filter(p => p.room === currentRoom).length === 1 ? 'person' : 'people'} in this room
        </div>
      )}

      {/* 3D Canvas - Full Screen */}
      <div className="w-full h-full">
        <Canvas shadows>
          <Suspense fallback={null}>
            {/* Environment and Lighting */}
            <Environment preset="city" />
            <ambientLight intensity={currentConfig.lighting.ambient.intensity} />
            <directionalLight 
              position={currentConfig.lighting.directional.position}
              intensity={currentConfig.lighting.directional.intensity}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            
            {/* Main Camera */}
            <PerspectiveCamera
              makeDefault
              fov={currentConfig.camera.fov}
              position={currentConfig.camera.position}
            />
            
            {/* Room */}
            <group position={[0, 0, 0]}>
              {rooms[currentRoom]}
            </group>

            {/* Other Players */}
            {socket && players && Object.keys(players)
              .filter(
                (playerId) =>
                  playerId !== socket.id &&
                  players[playerId]?.room === currentRoom &&
                  players[playerId]?.group === groupId
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

            {/* Local Player */}
            {socket && (
              <Character
                playerId={socket.id}
                players={players}
                currentRoom={currentRoom}
                socket={socket}
                movementKeys={movementKeys}
              />
            )}
            
            {/* Controls */}
            <OrbitControls 
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              maxPolarAngle={Math.PI / 1.5}
              minDistance={2}
              maxDistance={20}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}

export default Homepage