import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// Custom shader material for advanced effects
const CustomShaderMaterial = ({ time }) => {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        mouse: { value: new THREE.Vector2(0, 0) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mouse;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec2 uv = vUv;
          vec2 center = vec2(0.5);
          
          // Create dynamic patterns
          float pattern1 = sin(uv.x * 10.0 + time) * cos(uv.y * 10.0 + time);
          float pattern2 = sin(distance(uv, center) * 20.0 - time * 2.0);
          
          // Color mixing
          vec3 color1 = vec3(1.0, 0.8, 0.2); // Gold
          vec3 color2 = vec3(0.2, 0.8, 1.0); // Blue
          vec3 color3 = vec3(1.0, 0.2, 0.8); // Pink
          
          vec3 finalColor = mix(color1, color2, pattern1 * 0.5 + 0.5);
          finalColor = mix(finalColor, color3, pattern2 * 0.5 + 0.5);
          
          // Add glow effect
          float glow = sin(time * 2.0) * 0.3 + 0.7;
          finalColor *= glow;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    });
  }, []);

  useFrame((state) => {
    material.uniforms.time.value = state.clock.elapsedTime;
  });

  return <primitive object={material} />;
};

const ShaderPlane = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <CustomShaderMaterial />
    </mesh>
  );
};

const AdvancedShaders = () => {
  return (
    <div className="advanced-shaders">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <ShaderPlane />
        
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.1} />
          <ChromaticAberration offset={[0.002, 0.002]} />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default AdvancedShaders;
