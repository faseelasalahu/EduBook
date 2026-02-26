import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Float, MeshDistortMaterial } from '@react-three/drei'
import { useRef } from 'react'

const AnimatedStar = () => {
  const meshRef = useRef();

  // automatic star rottation
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.5;
    meshRef.current.rotation.x += delta * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        {/* shape of like star (Octahedron) */}
        <octahedronGeometry args={[1, 0]} /> 
        <MeshDistortMaterial 
          color="yellow" 
          speed={2} 
          distort={0.3} 
          radius={1} 
          emissive="orange" // star (Glow effect)
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  )
}

const Scene3D = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas style={{ pointerEvents: 'none' }} camera={{ position: [0, 0, 5], fov: 45 }} onContextMenu={(e) => e.stopPropagation()}>
        {/* (Lighting) */}
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="white" />
        
        {/*small stars at background */}
        <Stars 
          radius={200}   // distance b/w star
          depth={100}    // depth of star
          count={10000}  // number of start
          factor={9}    //size of star
          saturation={0} 
          fade 
          speed={2}   // star glittering speed
        />

       

        {/* rotate using mouse */}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}

export default Scene3D
