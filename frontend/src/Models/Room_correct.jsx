/* eslint-disable react/no-unknown-property */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import room from "./room.glb";
import Peer from "peerjs";

export default function Room(props) {
  const { nodes, materials } = useGLTF(room);

  return (
    <group {...props} dispose={null}>
      {/* Example wall with screen sharing */}

      <mesh
        geometry={nodes.wall_2_wall_0.geometry} // Wall geometry to display the screen
        material={materials.wall}
        position={[-5.303, 1.75, -6.605]} // Wall position (adjust if necessary)
        rotation={[0, -Math.PI / 2, 0]} // Wall rotation
        scale={0.01} // Wall scale
      />

      <mesh
        geometry={nodes.roof_2_ceiling_0.geometry}
        material={materials.ceiling}
        position={[6.563, 0, -6.396]}
        scale={0.01}
      />
      <mesh
        geometry={nodes.roof_1_s_0.geometry}
        material={materials.material}
        position={[6.563, 0, -6.396]}
        scale={0.01}
      />
      <mesh
        geometry={nodes.floor_floor_0.geometry}
        material={materials.floor}
        position={[6.563, 0, -6.396]}
        scale={0.01}
      />
      <mesh
        geometry={nodes.bala_panjereh_2_bala_panjereh_0.geometry}
        material={materials.bala_panjereh}
        position={[13.633, 3.312, 0]}
        scale={0.01}
      />
      <mesh
        geometry={nodes.sotoon_18_sotoon1_0.geometry}
        material={materials["sotoon.1"]}
        position={[-5.271, 1.75, -12.97]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={0.01}
      />
      <mesh
        geometry={nodes.F_w_0.geometry}
        material={materials.material_6}
        position={[14.547, 1.527, -13.057]}
        scale={0.01}
      />
      <mesh
        geometry={nodes.UP_g_0.geometry}
        material={materials.material_7}
        position={[14.547, 2.354, -13.057]}
        scale={0.01}
      />
      <mesh
        geometry={nodes.zirpanjereh_4_zirpanjereh_0.geometry}
        material={materials.material_0}
        position={[-2.213, 3.56, -10.815]}
        scale={0.01}
      />
      <mesh
        geometry={nodes.nime_6_nime_0.geometry}
        material={materials.nime}
        position={[16.813, 1.75, -13.14]}
        scale={0.01}
      />
      <mesh
        geometry={nodes.win_Win_0.geometry}
        material={materials.material_11}
        position={[5.93, 2.554, 0]}
        scale={0.01}
      />
      <mesh
        geometry={nodes.glass__0.geometry}
        material={materials.glass__0}
        position={[5.93, 2.554, 0]}
        scale={0.01}
      />
      <mesh
        geometry={nodes.R_9_01_0.geometry}
        material={materials.material_12}
        position={[12.814, 0, -0.004]}
        scale={0.01}
      />
      <mesh
        geometry={nodes.R_9_02_0.geometry}
        material={materials.material_13}
        position={[12.814, 0, -0.004]}
        scale={0.01}
      />
      <mesh
        geometry={nodes.R_9_GLASS_0.geometry}
        material={materials.material_1}
        position={[12.814, 0, -0.004]}
        scale={0.01}
      />
      {/* Add other room elements as needed */}
    </group>
  );
}

useGLTF.preload("/scene-transformed.glb");
