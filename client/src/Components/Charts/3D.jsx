import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../Context/themeContext';

const Bar = ({ position, height, color, label, labelPosition, isDark }) => {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {label && (
        <Text
          position={labelPosition}
          fontSize={0.5}
          color={isDark ? '#ffffff' : '#000000'}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

const Chart3D = ({ chartData }) => {
  const controlsRef = useRef();
  const { isDark } = useTheme();
  const labels = chartData?.labels || [];
  const values = chartData?.datasets?.[0]?.data || [];
  const colors = chartData?.datasets?.[0]?.backgroundColor || [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F06292', '#7986CB', '#9575CD'
  ];

  // Normalize values to fit better in 3D space
  const maxValue = Math.max(...values, 1);
  const normalizedValues = values.map(val => (val / maxValue) * 10);

  return (
    <div className={`h-[500px] w-full relative ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <Canvas 
        shadows
        camera={{ position: [0, 15, 15], fov: 50 }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={isDark ? 0.7 : 0.5} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={isDark ? 1.2 : 1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          color={isDark ? '#f0f0f0' : '#ffffff'}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color={isDark ? '#333333' : '#f0f0f0'} 
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Bars */}
        {normalizedValues.map((val, index) => (
          <group key={index}>
            <Bar
              position={[
                index * 2 - (values.length - 1), 
                0, 
                0
              ]}
              height={val}
              color={colors[index % colors.length]}
              label={labels[index]}
              labelPosition={[0, -1.5, 0]}
              isDark={isDark}
            />
            {/* Value label */}
            <Text
              position={[
                index * 2 - (values.length - 1),
                val + 0.5,
                0
              ]}
              fontSize={0.5}
              color={isDark ? '#ffffff' : '#000000'}
              anchorX="center"
              anchorY="middle"
            >
              {values[index]}
            </Text>
          </group>
        ))}

        {/* Axes */}
        <arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(-10, 0, 0), 2, isDark ? 0xbbbbbb : 0xff0000]} />
        <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -0.1, 0), 2, isDark ? 0xbbbbbb : 0x00ff00]} />
        <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -10), 2, isDark ? 0xbbbbbb : 0x0000ff]} />

        {/* Controls with scroll prevention */}
        <OrbitControls 
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          screenSpacePanning={false}
        />
      </Canvas>
    </div>
  );
};

export default Chart3D;