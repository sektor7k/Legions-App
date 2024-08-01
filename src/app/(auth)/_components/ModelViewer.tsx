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

  // Tüm materyalleri dolaş ve roughness/metalness değerlerini ayarla
  gltf.scene.traverse((node) => {
    if (node instanceof THREE.Mesh && node.material) {
      const material = node.material as THREE.MeshStandardMaterial;
      material.roughness = 0.5; // Yumuşaklık oranını artır
      material.metalness = 0.1; // Metalikliği azalt
    }
  });

  return <primitive ref={modelRef} object={gltf.scene} position={[0, -3, 0]} />;
};

const ModelViewer: React.FC = () => {
  return (
    <div className="relative h-[1200px] w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.5} 
          castShadow 
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={500}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <Model />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
