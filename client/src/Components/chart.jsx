import React, { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

const Chart3D = ({ data, type = 'pie', title }) => {
  const [hovered, setHovered] = useState(null);
  const [activeChart, setActiveChart] = useState(type);

  // Enhanced color palette
  const colors = [
    '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', 
    '#F59E0B', '#10B981', '#3B82F6', '#64748B'
  ];

  const chartData = {
    labels: data?.labels || ['Q1', 'Q2', 'Q3', 'Q4'],
    values: data?.values || [25, 40, 30, 35],
    colors: data?.colors || colors
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
      {/* Header with chart selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">{title}</h3>
        
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {['pie', 'bar', 'line'].map((chartType) => (
            <button
              key={chartType}
              onClick={() => setActiveChart(chartType)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeChart === chartType 
                  ? 'bg-white shadow-sm text-indigo-600 font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-4 py-3 border-b border-gray-200">
        {chartData.labels.map((label, i) => (
          <div key={i} className="flex items-center">
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: chartData.colors[i] }}
            />
            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>

      {/* Canvas Container */}
      <div className="h-96 w-full relative">
        <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          
          {activeChart === 'pie' && <PieChart data={chartData} hovered={hovered} setHovered={setHovered} />}
          {activeChart === 'bar' && <BarChart data={chartData} hovered={hovered} setHovered={setHovered} />}
          {activeChart === 'line' && <LineChart data={chartData} hovered={hovered} setHovered={setHovered} />}
          
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI/6}
            maxPolarAngle={Math.PI/2}
          />
        </Canvas>
      </div>

      {/* Info Panel */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        {hovered !== null ? (
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-gray-800">{chartData.labels[hovered]}</h4>
              <p className="text-sm text-gray-600">
                Value: <span className="font-medium">{chartData.values[hovered]}</span>
              </p>
            </div>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
              {Math.round(chartData.values[hovered]/chartData.values.reduce((a,b)=>a+b,0)*100)}%
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Hover over elements for details
          </p>
        )}
      </div>
    </div>
  );
};

// Enhanced Pie Chart
const PieChart = ({ data, hovered, setHovered }) => {
  const groupRef = React.useRef();
  const total = data.values.reduce((a, b) => a + b, 0);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      {data.values.map((value, i) => {
        const startAngle = data.values.slice(0, i).reduce((a, b) => a + b, 0) / total * Math.PI * 2;
        const angle = value / total * Math.PI * 2;
        const isHovered = hovered === i;
        
        return (
          <group key={i}>
            <mesh 
              rotation={[0, startAngle, 0]}
              onPointerOver={() => setHovered(i)}
              onPointerOut={() => setHovered(null)}
            >
              <cylinderGeometry args={[3, 3, 1, 32, 1, true, 0, angle]} />
              <meshStandardMaterial 
                color={data.colors[i]} 
                emissive={isHovered ? data.colors[i] : '#000000'}
                emissiveIntensity={isHovered ? 0.5 : 0}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
            
            <Text
              position={[
                Math.cos(startAngle + angle/2) * 4.5,
                0.5,
                Math.sin(startAngle + angle/2) * 4.5
              ]}
              fontSize={0.5}
              color="black"
              anchorX="center"
              anchorY="middle"
              visible={isHovered}
            >
              {data.labels[i]}
            </Text>
          </group>
        );
      })}
    </group>
  );
};

// Enhanced Bar Chart
const BarChart = ({ data, hovered, setHovered }) => {
  const maxValue = Math.max(...data.values);
  
  return (
    <group position={[0, -2, 0]}>
      {data.labels.map((label, i) => {
        const height = (data.values[i] / maxValue) * 5;
        const x = i * 2.5 - (data.labels.length - 1) * 1.25;
        const isHovered = hovered === i;
        
        return (
          <group key={i}>
            <mesh 
              position={[x, height/2, 0]}
              onPointerOver={() => setHovered(i)}
              onPointerOut={() => setHovered(null)}
            >
              <boxGeometry args={[1.5, height, 1.5]} />
              <meshStandardMaterial 
                color={data.colors[i]} 
                emissive={isHovered ? data.colors[i] : '#000000'}
                emissiveIntensity={isHovered ? 0.5 : 0}
                roughness={0.2}
                metalness={0.3}
              />
            </mesh>
            
            <Text
              position={[x, height + 0.5, 0]}
              fontSize={0.6}
              color="black"
              anchorX="center"
              anchorY="bottom"
              visible={isHovered}
            >
              {data.values[i]}
            </Text>
          </group>
        );
      })}
    </group>
  );
};

// Enhanced Line Chart
const LineChart = ({ data, hovered, setHovered }) => {
  const maxValue = Math.max(...data.values);
  const points = data.values.map((value, i) => {
    const x = i * 2.5 - (data.values.length - 1) * 1.25;
    const y = (value / maxValue) * 5;
    return new THREE.Vector3(x, y, 0);
  });

  return (
    <group position={[0, -2, 0]}>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(v => [v.x, v.y, v.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#3B82F6" linewidth={3} />
      </line>
      
      {points.map((point, i) => {
        const isHovered = hovered === i;
        return (
          <group key={i}>
            <mesh 
              position={point}
              onPointerOver={() => setHovered(i)}
              onPointerOut={() => setHovered(null)}
            >
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial 
                color={data.colors[i]} 
                emissive={isHovered ? data.colors[i] : '#000000'}
                emissiveIntensity={isHovered ? 0.5 : 0}
                roughness={0.1}
                metalness={0.7}
              />
            </mesh>
            
            <Text
              position={[point.x, point.y + 0.7, 0]}
              fontSize={0.6}
              color="black"
              anchorX="center"
              anchorY="bottom"
              visible={isHovered}
            >
              {data.values[i]}
            </Text>
          </group>
        );
      })}
    </group>
  );
};

const DataVisualizationDashboard = () => {
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    values: [45, 60, 35, 55, 70],
    colors: ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F59E0B']
  };

  const revenueData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D'],
    values: [120, 85, 65, 110],
    colors: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899']
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">3D Data Visualization</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart3D 
          data={salesData} 
          title="Quarterly Sales Performance" 
        />
        
        <Chart3D 
          data={revenueData} 
          title="Product Revenue Distribution" 
        />
      </div>
    </div>
  );
};

export default DataVisualizationDashboard;