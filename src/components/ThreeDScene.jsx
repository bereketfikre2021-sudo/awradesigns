import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

const Scene = () => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 2, -10]}>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#F5F5DC" />
      </mesh>
      
      {/* Furniture */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[-3, 0, -5]}>
          <boxGeometry args={[2, 1, 1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
        <mesh position={[3, 0, -5]}>
          <boxGeometry args={[1.5, 0.8, 0.8]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </Float>
    </group>
  );
};

const ThreeDScene = () => {
  return (
    <div className="three-d-scene">
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Scene />
        <OrbitControls enablePan={false} enableZoom={false} />
        <Environment preset="sunset" />
        <ContactShadows opacity={0.4} scale={10} blur={2} far={4.5} />
      </Canvas>
    </div>
  );
};

export default ThreeDScene;
