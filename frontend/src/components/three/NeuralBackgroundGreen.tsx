import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function NeuralParticles() {
  const ref = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  
  // Generate particles in a brain-like spherical distribution
  const [positions, connections] = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const connectionIndices: number[] = [];
    
    // Create brain-like shape with two hemispheres
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Create brain shape - elongated sphere with indentation
      let radius = 2.5 + Math.random() * 0.5;
      
      // Add some noise for organic look
      radius += Math.sin(theta * 3) * 0.3;
      radius += Math.cos(phi * 4) * 0.2;
      
      // Flatten slightly
      const x = radius * Math.sin(phi) * Math.cos(theta) * 1.2;
      const y = radius * Math.sin(phi) * Math.sin(theta) * 0.9;
      const z = radius * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    
    // Create neural connections between nearby particles
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (distance < 0.8 && Math.random() > 0.7) {
          connectionIndices.push(i, j);
        }
      }
    }
    
    return [positions, connectionIndices];
  }, []);

  // Create line geometry for connections
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(connections.length * 3);
    
    for (let i = 0; i < connections.length; i++) {
      const idx = connections[i];
      linePositions[i * 3] = positions[idx * 3];
      linePositions[i * 3 + 1] = positions[idx * 3 + 1];
      linePositions[i * 3 + 2] = positions[idx * 3 + 2];
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    return geometry;
  }, [positions, connections]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Neural connections - green/teal theme */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial 
          color="#10b981" 
          transparent 
          opacity={0.15}
        />
      </lineSegments>
      
      {/* Neurons (particles) - emerald/teal */}
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#34d399"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.z = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#10b981"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

export default function NeuralBackgroundGreen() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#34d399" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />
        <NeuralParticles />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
