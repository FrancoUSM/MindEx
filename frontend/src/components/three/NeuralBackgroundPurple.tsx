import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function NeuralParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, connections } = useMemo(() => {
    const count = 600;
    const positions = new Float32Array(count * 3);
    const connectionIndices: number[] = [];

    // Create brain-like shape with particles - purple neural theme
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Vary radius to create organic brain shape
      let radius = 2.5 + Math.random() * 0.8;
      
      // Add some noise for organic feel
      radius += Math.sin(theta * 3) * 0.3;
      radius += Math.cos(phi * 4) * 0.2;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    // Create neural connections between nearby particles
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < 0.7 && Math.random() > 0.7) {
          connectionIndices.push(i, j);
        }
      }
    }

    return { positions, connections: connectionIndices };
  }, []);

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
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#a855f7"
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.9}
        />
      </Points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#7c3aed" transparent opacity={0.25} />
      </lineSegments>
    </>
  );
}

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 150;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      pointsRef.current.rotation.z = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#c084fc"
        size={0.025}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

export default function NeuralBackgroundPurple() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950" />
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.6} color="#a855f7" />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#7c3aed" />
        <NeuralParticles />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
