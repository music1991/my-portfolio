import { useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Pointer = RefObject<{ x: number; y: number }>;

/**
 * Animated wireframe data-grid: a plane of points that gently undulates
 * (sine displacement) and drifts to follow the pointer, rendered behind
 * the hero copy. Colors are pulled from the design system's accent token.
 */
function WaveGrid({
  pointer,
  color,
  size,
  opacity,
}: {
  pointer: Pointer;
  color: string;
  size: number;
  opacity: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const cols = 46;
  const rows = 26;
  const spacing = 0.32;

  const positions = useMemo(() => {
    const arr = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let j = 0; j < rows; j++) {
      for (let x = 0; x < cols; x++) {
        arr[i * 3] = (x - (cols - 1) / 2) * spacing;
        arr[i * 3 + 1] = 0;
        arr[i * 3 + 2] = (j - (rows - 1) / 2) * spacing;
        i++;
      }
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const geom = pointsRef.current?.geometry as THREE.BufferGeometry | undefined;
    if (geom) {
      const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
      for (let k = 0; k < posAttr.count; k++) {
        const x = posAttr.getX(k);
        const z = posAttr.getZ(k);
        posAttr.setY(k, Math.sin(x * 0.9 + t) * 0.28 + Math.cos(z * 0.9 + t * 0.8) * 0.28);
      }
      posAttr.needsUpdate = true;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += (pointer.current.x * 0.35 - groupRef.current.rotation.y) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={size} transparent opacity={opacity} sizeAttenuation />
      </points>
    </group>
  );
}

function CameraRig({ pointer }: { pointer: Pointer }) {
  useFrame(({ camera }) => {
    camera.position.y += (2.6 - pointer.current.y * 1.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/**
 * The Three.js part of the hero. Kept in its own module so it's loaded lazily
 * (three + r3f are most of the JS) and never blocks the first paint.
 */
export default function HeroGrid({ pointer, theme }: { pointer: Pointer; theme: string }) {
  const color = theme === "dark" ? "#3b82f6" : "#2563eb";
  const size = theme === "dark" ? 0.045 : 0.036;
  const opacity = theme === "dark" ? 0.75 : 0.45;

  return (
    <Canvas camera={{ position: [0, 2.6, 7.5], fov: 50 }} dpr={[1, 1.5]}>
      <WaveGrid pointer={pointer} color={color} size={size} opacity={opacity} />
      <CameraRig pointer={pointer} />
    </Canvas>
  );
}
