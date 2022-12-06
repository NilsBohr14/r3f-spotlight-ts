import { useRef } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { SpotLight } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


function App() {
  return (
    <Canvas shadows camera={{ position: [0, 3, 10], fov: 40, near: 1, far: 50 }}>
      <color attach="background" args={['#1c1c1c']} />
      <fog attach="fog" args={['#1c1c1c', 5, 20]} />
      <ambientLight intensity={0.05} />
      <Scene />
    </Canvas>
  );
}

function Scene() {
  const spotlight = useRef<any>(null!);
  const state = useThree();
  const canvasViewPort = state.viewport;
  const url = 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/cyborg-female/model.gltf';
  const { nodes, materials } = useLoader(GLTFLoader, url, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/')
    loader.setDRACOLoader(dracoLoader)
  })

  useFrame((state) => {
    spotlight.current.target.position.set((state.mouse.x * canvasViewPort.width) / 2, (state.mouse.y * canvasViewPort.height) / 2, 0);
    spotlight.current.target.updateMatrixWorld();
  })

  return (
    <>
      <SpotLight color="#f6f4c5" position={[2, 5, 0]} castShadow ref={spotlight} penumbra={1} distance={10} angle={0.3} attenuation={8} intensity={2} decay={2} />
      <mesh castShadow receiveShadow scale={[1.8, 1.8, 1.8]} position={[0, -2, 0]} geometry={(nodes.characterMedium as THREE.Mesh).geometry} material={materials['skin.001']} />
      <mesh receiveShadow position={[0, -2, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 100]} />
        <meshPhongMaterial />
      </mesh>
    </>
  );
}

export default App
