"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float, Sparkles, MeshReflectorMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Vibrant neon palette
const GREEN = "#10d96a";
const CYAN = "#22d3ee";
const PINK = "#ec4899";
const VIOLET = "#8b5cf6";

interface CandleData {
  x: number;
  bodyTop: number;
  bodyBottom: number;
  wickTop: number;
  wickBottom: number;
  up: boolean;
}

function useCandles(count: number): CandleData[] {
  return useMemo(() => {
    const candles: CandleData[] = [];
    let price = 1.2;
    const spacing = 0.85;
    const startX = -((count - 1) * spacing) / 2;
    for (let i = 0; i < count; i++) {
      const drift = 0.22;
      const change = (Math.sin(i * 1.3) * 0.5 + (Math.random() - 0.35)) * 0.7 + drift;
      const open = price;
      const close = Math.max(0.3, price + change);
      const up = close >= open;
      const high = Math.max(open, close) + Math.random() * 0.35 + 0.1;
      const low = Math.min(open, close) - (Math.random() * 0.35 + 0.1);
      candles.push({
        x: startX + i * spacing,
        bodyTop: Math.max(open, close),
        bodyBottom: Math.min(open, close),
        wickTop: high,
        wickBottom: Math.max(0.05, low),
        up,
      });
      price = close;
    }
    return candles;
  }, [count]);
}

function Candle({ data, index, animate }: { data: CandleData; index: number; animate: boolean }) {
  const bodyRef = useRef<THREE.Mesh>(null);
  // Up candles glow green→cyan, down candles glow pink→violet for vibrancy
  const color = data.up ? (index % 2 === 0 ? GREEN : CYAN) : (index % 2 === 0 ? PINK : VIOLET);
  const bodyHeight = Math.max(0.18, data.bodyTop - data.bodyBottom);
  const bodyY = (data.bodyTop + data.bodyBottom) / 2;
  const wickHeight = data.wickTop - data.wickBottom;
  const wickY = (data.wickTop + data.wickBottom) / 2;

  useFrame((state) => {
    if (!animate || !bodyRef.current) return;
    const t = state.clock.elapsedTime;
    bodyRef.current.scale.y = 1 + Math.sin(t * 1.5 + index * 0.6) * 0.04;
  });

  return (
    <group position={[data.x, 0, 0]}>
      <mesh position={[0, wickY, 0]}>
        <boxGeometry args={[0.08, wickHeight, 0.08]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
      <mesh ref={bodyRef} position={[0, bodyY, 0]} castShadow>
        <boxGeometry args={[0.44, bodyHeight, 0.44]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.4}
          metalness={0.6}
          roughness={0.15}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Scene({ count, animate }: { count: number; animate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const candles = useCandles(count);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = animate ? Math.sin(t * 0.6) * 0.15 - 0.3 : -0.3;
    const targetRotY = pointer.x * 0.4 + (animate ? Math.sin(t * 0.15) * 0.15 : 0);
    const targetRotX = -pointer.y * 0.2 + 0.05;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <>
      <color attach="background" args={["#080c10"]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
      <pointLight position={[-6, 3, 4]} intensity={50} color={GREEN} distance={25} />
      <pointLight position={[6, 0, 6]} intensity={40} color={VIOLET} distance={25} />
      <pointLight position={[0, 4, -4]} intensity={30} color={CYAN} distance={25} />

      <Float speed={animate ? 1.2 : 0} rotationIntensity={0} floatIntensity={animate ? 0.5 : 0}>
        <group ref={groupRef}>
          {candles.map((c, i) => (
            <Candle key={i} data={c} index={i} animate={animate} />
          ))}
        </group>
      </Float>

      {/* floating glints */}
      <Sparkles count={60} scale={[14, 6, 6]} size={2.5} speed={animate ? 0.4 : 0} color={CYAN} opacity={0.6} />

      {/* reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={1}
          mixStrength={40}
          roughness={0.9}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0e14"
          metalness={0.6}
          mirror={0}
        />
      </mesh>

      <ContactShadows position={[0, -1.55, 0]} opacity={0.4} scale={18} blur={2.5} far={6} color="#000000" />

      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur radius={0.7} />
      </EffectComposer>
    </>
  );
}

export default function CandlestickScene() {
  const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const isSmall = typeof window !== "undefined" && window.innerWidth < 640;
  const animate = !prefersReduced;
  const count = isSmall ? 9 : 14;

  return (
    <Canvas
      shadows
      dpr={[1, isSmall ? 1.5 : 2]}
      camera={{ position: [0, 1.5, 11], fov: 42 }}
      gl={{ antialias: true, alpha: false }}
      style={{ width: "100%", height: "100%" }}
    >
      <Scene count={count} animate={animate} />
    </Canvas>
  );
}
