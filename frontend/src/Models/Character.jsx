import React, { useEffect, useState, forwardRef, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import model from './man.glb'

const Character = ({ playerId, players, socket, currentRoom, movementKeys = {} }) => {
  const { scene, animations } = useGLTF(model);
  const characterRef = useRef();
  const { actions, mixer } = useAnimations(animations, characterRef);
  const prevAnimation = useRef('idle');
  
  const size = {
    main: [0.2, 0.2, 0.2],
    movieRoom: [0.006, 0.006, 0.006],
    movieRoom2: [0.006, 0.006, 0.006],
  }

  // Set initial position based on room
  useEffect(() => {
    if (characterRef.current) {
      characterRef.current.position.set(0, 0, 0);
      characterRef.current.rotation.set(0, Math.PI, 0);
      
      // Reset animation
      if (actions['Take 001']) {
        actions['Take 001'].stop();
      }
    }
  }, [currentRoom, actions]);

  const isLocalPlayer = playerId === socket?.id;
  const speed = {
    main: 0.1,
    movieRoom: 0.05,
    movieRoom2: 0.05,
  };
  const direction = useRef(new THREE.Vector3());
  const [isMoving, setIsMoving] = useState(false);
  const clock = useRef(new THREE.Clock());
  
  scene.traverse((child) => {
    if (child.isMesh) {
      child.geometry.center();
    }
  });

  const height = {
    movieRoom: 1,
    movieRoom2: 1,
    main: 16.8 * 2
  }

  // Handle animations based on movement
  useEffect(() => {
    if (!isLocalPlayer) return;
    
    const moving = movementKeys && Object.values(movementKeys).some(key => key);
    
    if (moving && actions['Take 001'] && prevAnimation.current !== 'walking') {
      if (prevAnimation.current === 'idle' && actions['Take 001']) {
        actions['Take 001'].reset().fadeIn(0.2).play();
      }
      prevAnimation.current = 'walking';
      setIsMoving(true);
    } else if (!moving && actions['Take 001'] && prevAnimation.current !== 'idle') {
      actions['Take 001'].fadeOut(0.2);
      prevAnimation.current = 'idle';
      setIsMoving(false);
    }
  }, [movementKeys, actions, isLocalPlayer]);

  useFrame((state, delta) => {
    if (!isLocalPlayer || !characterRef.current || !movementKeys) return;
    
    // Update animation mixer
    if (mixer) {
      mixer.update(delta);
    }
    
    const currentSpeed = speed[currentRoom] || speed.main;
    const moveSpeed = currentSpeed * 60 * delta; // Normalize by delta time
    
    // Reset direction
    direction.current.set(0, 0, 0);
    
    // Handle movement
    if (movementKeys.w) direction.current.z -= 1;
    if (movementKeys.s) direction.current.z += 1;
    if (movementKeys.a) direction.current.x -= 1;
    if (movementKeys.d) direction.current.x += 1;
    
    // Normalize direction vector to prevent faster diagonal movement
    if (direction.current.lengthSq() > 0) {
      direction.current.normalize();
      
      // Rotate character to face movement direction
      const targetRotation = Math.atan2(direction.current.x, direction.current.z);
      characterRef.current.rotation.y = THREE.MathUtils.lerp(
        characterRef.current.rotation.y,
        targetRotation,
        0.1 // Rotation speed
      );
      
      // Move character
      characterRef.current.position.x += direction.current.x * moveSpeed;
      characterRef.current.position.z += direction.current.z * moveSpeed;
    }
    
    // Update camera to follow character
    if (state.camera) {
      const cameraOffset = new THREE.Vector3(0, height[currentRoom] || 3, 5);
      cameraOffset.applyQuaternion(characterRef.current.quaternion);
      
      const targetPosition = new THREE.Vector3().addVectors(
        characterRef.current.position,
        cameraOffset
      );
      
      state.camera.position.lerp(targetPosition, 0.1);
      state.camera.lookAt(characterRef.current.position);
    }
    
    // Emit movement to server
    if (socket) {
      const currentlyMoving = Object.values(movementKeys).some(key => key);
      if (currentlyMoving || isMoving !== currentlyMoving) {
        socket.emit("move", {
          position: characterRef.current.position.toArray(),
          rotation: characterRef.current.rotation.toArray(),
          isMoving: currentlyMoving
        });
        setIsMoving(currentlyMoving);
      }
    }
  });

  if (!currentRoom || !size[currentRoom]) {
    console.error(`Invalid room or size for room: ${currentRoom}`);
    return null;
  }

  const scale = size[currentRoom] || 1;
  
  return (
    <mesh ref={characterRef} scale={Array.isArray(scale) ? scale : [scale, scale, scale]}>
      <primitive object={scene} />
    </mesh>
  );
};

export default Character;
