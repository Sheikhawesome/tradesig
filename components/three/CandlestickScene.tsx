"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";

const GREEN = "#20a366";
const RED = "#e0524f";

interface CandleData {
  x: number;
  bodyTop: number;
  bodyBottom: number;
  wickTop: number;
  wickBottom: number;
  up: boolean;
}

// Generate an upward-trending series of candlesticks
function useCandles(count: number): CandleData[] {
  return useMemo(() => {
    const candles: CandleData[] = [];
    let price = 1.2;
    const spacing = 0.85;
    const startX = -((count - 1) * spacing) / 2;
    for (let i = 0; i < count; i++) {
      const drift = 0.22; // upward bias
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
  const color = data.up ? GREEN : RED;
  const bodyHeight = Math.max(0.18, data.bodyTop - data.bodyBottom);
  const bodyY = (data.bodyTop + data.bodyBottom) / 2;
  const wickHeight = data.wickTop - data.wickBottom;
  const wickY = (data.wickTop + data.wickBottom) / 2;

  // Subtle "live ticking" pulse on each candle body
  useFrame((state) => {
    if (!animate || !bodyRef.current) return;
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 1.5 + index * 0.6) * 0.03;
    bodyRef.current.scale.y = pulse;
  });

  return (
    <group position={[data.x, 0, 0]}>
      {/* Wick */}
      <mesh position={[0, wickY, 0]}>
        <boxGeometry args={[0.07, wickHeight, 0.07]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.85} />
      </mesh>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, bodyY, 0]} castShadow>
        <boxGeometry args={[0.42, bodyHeight, 0.42]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          metalness={0.4}
          roughness={0.25}
          transparent
          opacity={0.92}
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
    // Gentle bob
    groupRef.current.position.y = animate ? Math.sin(t * 0.6) * 0.15 - 0.5 : -0.5;
    // Mouse parallax + slow auto-rotation
    const targetRotY = pointer.x * 0.35 + (animate ? Math.sin(t * 0.15) * 0.15 : 0);
    const targetRotX = -pointer.y * 0.18 + 0.05;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} castShadow />
      <pointLight position={[-6, 3, 4]} intensity={40} color={GREEN} distance={20} />
      <pointLight position={[6, -2, 6]} intensity={25} color="#3b82f6" distance={20} />

      <Float speed={animate ? 1.2 : 0} rotationIntensity={0} floatIntensity={animate ? 0.4 : 0}>
        <group ref={groupRef}>
          {candles.map((c, i) => (
            <Candle key={i} data={c} index={i} animate={animate} />
          ))}
        </group>
      </Float>

      <ContactShadows position={[0, -1.4, 0]} opacity={0.45} scale={18} blur={2.5} far={6} color="#000000" />
    </>
  );
}

export default function CandlestickScene() {
  // Respect reduced-motion and scale down on small screens
  const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const isSmall = typeof window !== "undefined" && window.innerWidth < 640;
  const animate = !prefersReduced;
  const count = isSmall ? 9 : 14;

  return (
    <Canvas
      shadows
      dpr={[1, isSmall ? 1.5 : 2]}
      camera={{ position: [0, 1.5, 11], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Scene count={count} animate={animate} />
    </Canvas>
  );
}
