/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 .\gallery_museum_showroom_banquet_hall.glb --transform 
Files: .\gallery_museum_showroom_banquet_hall.glb [19.84MB] > C:\Users\jaind\Workshop\frontend\src\Models\gallery_museum_showroom_banquet_hall-transformed.glb [2.75MB] (86%)
Author: jimbogies (https://sketchfab.com/jimbogies)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/gallery-museum-showroom-banquet-hall-7ab823cde7214b2b98f6672efc2ab34f
Title: Gallery Museum Showroom Banquet Hall
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'
import scene from "./gallery_museum_showroom_banquet_hall-transformed.glb"
export default function Gallery(props) {
  const { nodes, materials } = useGLTF(scene)
  return (
    <group {...props} dispose={null}>
      <lineSegments geometry={nodes.Material2_1.geometry} material={materials.edge_color000255} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Material2.geometry} material={materials['Wood08-basecolor']} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Material2_2.geometry} material={materials.Concrete} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Material2_3.geometry} material={materials.blackout} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Material2_4.geometry} material={materials.Plaster} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Material2_5.geometry} material={materials.WallPlaster} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Material2_6.geometry} material={materials.Concrete1} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Material2_7.geometry} material={materials.window} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Material2_8.geometry} material={materials.Light} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Material3.geometry} material={materials.material} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/gallery_museum_showroom_banquet_hall-transformed.glb')
