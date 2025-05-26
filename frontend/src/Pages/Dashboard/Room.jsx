import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Character from "../../Models/Character";
import { Room as RoomModel } from "../../Models/Room.jsx";
import Gallery from "../../Models/Gallery.jsx";
import useSocket from "../../hooks/useSocket.jsx";
import { OtherCharacter } from "../../Models/OtherCharacter.jsx";
import axios from 'axios';
import RoomManager from '@/components/RoomManager';
import Chatbox from '../../components/Chatbox.jsx';
import * as THREE from "three";

function Room() {
  const { roomName } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [errorRoom, setErrorRoom] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  // State to track keyboard presses for movement
  const [movementKeys, setMovementKeys] = useState({
      w: false, a: false, s: false, d: false
  });

  // Ref for OrbitControls
  const controlsRef = useRef();

  const { socket, players, changeRoom } = useSocket("http://localhost:3000");

  // Log the players state whenever it changes
  useEffect(() => {
      console.log('Players state updated:', players);
  }, [players]);

  // Get token from localStorage
  const getAuthToken = () => {
      return localStorage.getItem('token');
  };

  // Effect 1: Fetch room details when roomName changes
  useEffect(() => {
    const fetchRoomDetails = async () => {
        if (!roomName) {
            setLoadingRoom(false);
            return;
        }

        setLoadingRoom(true); // Start loading API
        setRoomDetails(null); // Clear previous room details
        setErrorRoom('');    // Clear previous error
        
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/user/room/${roomName}`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            setRoomDetails(response.data.room);
            setLoadingRoom(false); // Set loading false after successful API fetch

        } catch (err) {
            console.error('Error fetching room details:', err);
            setErrorRoom(err.response?.data?.message || 'Failed to fetch room details');
            setRoomDetails(null);
            setLoadingRoom(false); // Set loading false on fetch error
        }
    };

    fetchRoomDetails();

  }, [roomName]); // Depend only on roomName

  // Effect 2: Join socket room when socket is ready and roomDetails are fetched
  useEffect(() => {
      if (socket && roomDetails) {
          console.log(`Socket ready and room details fetched. Attempting to join socket room: ${roomDetails.groupName}`);
          changeRoom(roomDetails.groupName, roomDetails.groupName); // Use roomName for both room and group for socket
          // Loading state is now managed by Effect 1 based on API fetch completion
      } else if (roomName && !roomDetails && !loadingRoom && !errorRoom) {
          // This case could happen if fetchRoomDetails finished (loadingRoom is false)
          // but failed to set roomDetails without setting an error (unlikely but for robustness)
          console.warn("Room details fetch finished, but details are null and no error. Check API response.");
          // Consider setting an error or retrying here if needed
      }
  }, [socket, roomDetails, changeRoom, roomName, loadingRoom, errorRoom]); // Depend on socket, roomDetails, and changeRoom function

  // Effect to handle keyboard input for movement
  useEffect(() => {
    const handleKeyDown = (e) => {
        // Prevent default to stop browser scrolling/other actions
        if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(e.key.toLowerCase())) {
             e.preventDefault();
        }
        // Only capture WASD keys
        if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
            console.log('Room - Key Down:', e.key, movementKeys); // Log key down
            setMovementKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
        }
    };

    const handleKeyUp = (e) => {
        if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
             console.log('Room - Key Up:', e.key, movementKeys); // Log key up
             setMovementKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [movementKeys]); // Added movementKeys to dependencies to log updated state

  // Effect to manage OrbitControls based on movement keys
  useEffect(() => {
      const isMoving = Object.values(movementKeys).some(key => key);
      console.log('Room - Movement keys state:', movementKeys, 'Is Moving:', isMoving); // Log movement state
      if (controlsRef.current) {
          controlsRef.current.enabled = !isMoving;
           console.log('Room - OrbitControls enabled:', controlsRef.current.enabled); // Log OrbitControls state
      }
  }, [movementKeys]); // Depend on movementKeys state


  // Cleanup function for socket when leaving the room page or roomName changes
  useEffect(() => {
      return () => {
          if (socket && roomDetails) {
               // Need to implement a socket leave room handler
              console.log(`Leaving socket room: ${roomDetails.groupName}`);
              socket.emit('leave-room', { roomName: roomDetails.groupName });
               // Consider also explicitly leaving the socket.io room here if useSocket doesn't handle it on changeRoom:
               // socket.leave(roomDetails.groupName);
          }
      };
  }, [socket, roomDetails]); // Depend on socket and roomDetails for cleanup


  // Placeholder for screen sharing logic
  const handleShareScreen = async () => {
    if (isSharingScreen) {
        // Stop sharing logic here
        console.log('Stopping screen share');
        setIsSharingScreen(false);
        // TODO: Implement stopping media stream and notifying others via socket
    } else {
        // Start sharing logic here
        console.log('Starting screen share');
        try {
            // You would typically use navigator.mediaDevices.getDisplayMedia()
            // to get the screen stream and then send it via WebRTC.
            // This part needs manual implementation.
            alert("Screen sharing initiated. WebRTC setup is required for streaming.");
            setIsSharingScreen(true);
            // TODO: Implement capturing screen, setting up WebRTC connection, and signaling via socket
        } catch (error) {
            console.error('Error starting screen share:', error);
            setIsSharingScreen(false);
        }
    }
  };


  if (!roomName) {
    // If no roomName in URL, show RoomManager to create/join
    return <RoomManager />;
  }

  // Show loading state while fetching room details
  if (loadingRoom) { 
    return <div className="flex items-center justify-center min-h-screen text-white">Loading room details...</div>; // Updated message
  }

  if (errorRoom || !roomDetails) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {errorRoom || "Room not found"}</div>;
  }

  // Render the 3D environment and characters only when room details are loaded and socket is available
  // The loadingRoom state (managed by Effect 1) now primarily reflects the API fetch, 
  // so we also explicitly check for socket and roomDetails here before rendering the 3D scene.
  return (
    <div className="fixed inset-0 bg-black">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-50">
        <Sidebar />
      </div>

      {/* Main 3D Canvas Area */}
      {roomDetails && socket ? (
        <div className="w-full h-full">
          <Canvas camera={{ position: [10, 5, 10], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight intensity={1} position={[10, 10, 10]} />
            <directionalLight position={[0, 10, 0]} intensity={1} />

            {/* Render the selected room theme model */}
            {roomDetails.themeImage === "gallery-theme.png" ? <Gallery /> : <RoomModel />}

            {/* Render the current user's character, passing movementKeys */}
            {players && players[socket.id] && roomDetails && (
              <Character
                playerId={socket.id}
                players={players}
                currentRoom={roomDetails.groupName}
                socket={socket}
                movementKeys={movementKeys} // Pass movement keys
              />
            )}

            {/* Render other players */}
            {players && Object.keys(players)
              .filter(
                (playerId) =>
                  playerId !== socket.id &&
                  players[playerId]?.room === roomDetails.groupName
              )
              .map((playerId) => (
                <OtherCharacter
                  key={playerId}
                  playerId={playerId}
                  players={players}
                  socket={socket}
                  currentRoom={roomDetails.groupName}
                />
              ))}

            
            {/* OrbitControls for camera movement, with ref */}
            <OrbitControls 
              ref={controlsRef}
              maxPolarAngle={Math.PI / 2}
              enabled={!Object.values(movementKeys).some(key => key)} // Disable when moving
            />
          </Canvas>
        </div>
      ) : ( !loadingRoom && !errorRoom && // Only show this if not loading or erroring, but missing socket/details
           <div className="flex items-center justify-center min-h-screen text-yellow-500">Waiting for socket connection...</div>
      )}

      {/* UI for Screen Share and Chatbox */}
       {roomDetails && socket && ( // Only show UI if room details loaded and socket is connected
        <div className="fixed bottom-0 right-0 p-4 z-50 flex items-center">
          {/* Screen Share Button */}
          <button 
              onClick={handleShareScreen}
              className={`ml-2 p-2 text-white rounded-lg ${isSharingScreen ? 'bg-red-600' : 'bg-green-600'}`}
          >
              {isSharingScreen ? 'Stop Sharing' : 'Share Screen'}
          </button>

          {/* Chatbox Toggle is now part of the Chatbox component */}
        </div>
       )}

      {/* Chatbox Component */}
      {socket && roomDetails && (
          <Chatbox socket={socket} roomName={roomDetails.groupName} />
      )}

       {/* Placeholder for screen share video display */}
       {/* You would render a <video> element here when someone is sharing their screen */}
       {/* This part also requires significant manual implementation */} 

    </div>
  );
}

export default Room;
