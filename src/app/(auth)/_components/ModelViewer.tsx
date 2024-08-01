// components/ModelViewer.tsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const Model: React.FC = () => {
  const gltf = useLoader(GLTFLoader, '/castrum.glb');
  const modelRef = useRef<THREE.Object3D>(null);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01; // Modelin y ekseni etrafında dönmesi için
    }
  });

  return <primitive ref={modelRef} object={gltf.scene} position={[0, -3, 0]} />; // Modelin pozisyonunu ayarlayın
};

const ModelViewer: React.FC = () => {
  return (
    <div className="relative h-[1200px] w-full ">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, -5, -5]} intensity={1.5} />
        <directionalLight position={[5, -5, 5]} intensity={1.5} />
        <directionalLight position={[-5, 5, -5]} intensity={1.5} />
        <Model />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
