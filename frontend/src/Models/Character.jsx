import React, { useEffect, useState, forwardRef, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import model from './man.glb'

const Character = ({ playerId, players, socket, currentRoom, movementKeys }) => {
  const { scene, animations } = useGLTF(model);
  const characterRef = useRef();
  const { actions } = useAnimations(animations, characterRef);
  
  const size = {
    main: [0.2, 0.2, 0.2],
    movieRoom: [0.006, 0.006, 0.006],
    movieRoom2: [0.006, 0.006, 0.006],
  }

  useEffect(() => {
    if (characterRef.current) {
      characterRef.current.position.x = 0;
      characterRef.current.position.z = 0;
    }
  }, [currentRoom])

  const isLocalPlayer = playerId === socket.id;
  const speed = {
    main: 2,
    movieRoom: 0.15,
    movieRoom2: 0.15,
  }
  const direction = new THREE.Vector3();
  const [isMoving, setIsMoving] = useState(false);
  
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

  useEffect(() => {
    if (!isLocalPlayer) return;

    const moving = Object.values(movementKeys).some(key => key);
    console.log('Character - movementKeys:', movementKeys, 'Moving:', moving);
    
    if (moving && actions["Take 001"]) {
      actions["Take 001"].play();
      setIsMoving(true);
    } else if (actions["Take 001"]) {
      actions["Take 001"].stop();
      setIsMoving(false);
    }
  }, [movementKeys, actions, isLocalPlayer]);

  useFrame(({ camera }) => {
    if (isLocalPlayer && characterRef.current && movementKeys) {
      direction.set(0, 0, 0);

      if (movementKeys.w) direction.z += speed[currentRoom];
      if (movementKeys.s) direction.z -= speed[currentRoom];
      if (movementKeys.a) characterRef.current.rotation.y += 0.05;
      if (movementKeys.d) characterRef.current.rotation.y -= 0.05;

      direction.applyQuaternion(characterRef.current.quaternion);
      characterRef.current.position.add(direction);

      camera.position.set(
        characterRef.current.position.x,
        characterRef.current.position.y + height[currentRoom],
        characterRef.current.position.z
      );

      camera.rotation.set(
        0,
        characterRef.current.rotation.y + Math.PI,
        0
      );

      const currentlyMoving = Object.values(movementKeys).some(key => key);
      if (socket && (currentlyMoving || isMoving !== currentlyMoving)) {
        socket.emit("move", {
          position: characterRef.current.position.toArray(),
          rotation: characterRef.current.rotation.toArray(),
          isMoving: currentlyMoving
        });
        setIsMoving(currentlyMoving);
      }
    }
  });

  return (
    <mesh ref={characterRef} scale={[size[currentRoom]]}>
      <primitive object={scene} />
    </mesh>
  );
};

export default Character;
