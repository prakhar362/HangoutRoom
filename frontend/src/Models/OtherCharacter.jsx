import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGraph } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  PositionalAudio,
  Text,
  Text3D,
} from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import model from "./otherCharacter.glb";
import * as THREE from "three";
export function OtherCharacter(props) {
  const group = React.useRef();
  const { scene, animations } = useGLTF(model);
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);
  const {
    playerId,
    players,
    socket,
    currentRoom,
  } = props;
  const size = {
    main: [0.2, 0.2, 0.2],
    movieRoom: [0.006, 0.006, 0.006],
    movieRoom2: [0.006, 0.006, 0.006],
  };
  const [playerData, setPlayerData] = useState(players[playerId]);
  useEffect(() => {
    setPlayerData(players[playerId]);
    
  }, [players, playerId]);
  if (!playerData || !playerData.position) return null;
  useEffect(() => {
    if (playerData.isMoving) {
      actions["Take 001"].play();
    } else {
      actions["Take 001"].stop();
    } // Cl
  }, [playerData]);
  
  return (
    <group
      scale={size[currentRoom]}
      position={[
        playerData.position.x || 0,
        playerData.position.y || 0,
        playerData.position.z || 0,
      ]}
      rotation={[
        playerData.rotation?._x || 0,
        playerData.rotation?._y || 0,
        playerData.rotation?._z || 0,
      ]}
      ref={group}
      dispose={null}
    >
      <group name="Sketchfab_Scene">
        <primitive object={nodes._rootJoint} />
        <skinnedMesh
          name="Object_96"
          geometry={nodes.Object_96.geometry}
          material={materials.rp_nathan_animated_003_mat}
          skeleton={nodes.Object_96.skeleton}
        />
      </group>
    </group>
  );
}

// useGLTF.preload('/nathan_animated_003_-_walking_3d_man-transformed.glb')
