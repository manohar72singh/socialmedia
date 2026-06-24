import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Sparkles, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShapes() {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
      groupRef.current.rotation.z = t * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} position={[-3, 1, -2]}>
          <MeshDistortMaterial
            color="#8b5cf6"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <Sphere args={[1.5, 64, 64]} position={[4, -1, -5]}>
          <MeshDistortMaterial
            color="#ec4899"
            attach="material"
            distort={0.3}
            speed={1.5}
            roughness={0.1}
            metalness={0.9}
          />
        </Sphere>
      </Float>

      <Float speed={2.5} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[0.8, 64, 64]} position={[0, 3, -8]}>
          <MeshDistortMaterial
            color="#fbbf24"
            attach="material"
            distort={0.5}
            speed={3}
            roughness={0.3}
            metalness={1}
          />
        </Sphere>
      </Float>
    </group>
  );
}

export default function Hero3DBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-60">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.3} color="#fbbf24" />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
