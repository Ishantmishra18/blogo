import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import html2canvas from 'html2canvas';

const SimpleDataViz = ({ data, title }) => {
  const [is3D, setIs3D] = useState(false);
  const [hovered, setHovered] = useState(null);
  const chartRef = useRef();

  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F59E0B'];

  const handleDownload = async () => {
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = `${title.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div ref={chartRef} className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIs3D(!is3D)}
            className="px-3 py-1 bg-gray-100 rounded-md text-sm"
          >
            {is3D ? 'Switch to 2D' : 'Switch to 3D'}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
          >
            Download PNG
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {data.labels.map((label, i) => (
          <div key={i} className="flex items-center">
            <span 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: colors[i] }}
            />
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>

      <div className="h-64 w-full relative">
        {is3D ? (
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
            <ambientLight intensity={0.7} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            
            {data.labels.map((label, i) => {
              const height = data.values[i] / Math.max(...data.values) * 3;
              const x = i * 2 - (data.labels.length - 1);
              const isHovered = hovered === i;
              
              return (
                <group key={i}>
                  <mesh 
                    position={[x, height/2, 0]}
                    onPointerOver={() => setHovered(i)}
                    onPointerOut={() => setHovered(null)}
                  >
                    <boxGeometry args={[1, height, 1]} />
                    <meshStandardMaterial 
                      color={colors[i]} 
                      emissive={isHovered ? colors[i] : '#000000'}
                      emissiveIntensity={0.3}
                    />
                  </mesh>
                </group>
              );
            })}
            
            <OrbitControls enableZoom={true} />
          </Canvas>
        ) : (
          <div className="h-full w-full flex items-end gap-1">
            {data.labels.map((label, i) => {
              const height = `${(data.values[i] / Math.max(...data.values)) * 100}%`;
              return (
                <div 
                  key={i}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 transition-all relative"
                  style={{ 
                    height,
                    backgroundColor: colors[i]
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {hovered === i && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      {label}: {data.values[i]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {hovered !== null && (
        <div className="mt-2 text-sm text-center">
          {data.labels[hovered]}: {data.values[hovered]} (
          {Math.round(data.values[hovered]/data.values.reduce((a,b)=>a+b,0)*100)}%)
        </div>
      )}
    </div>
  );
};

const DataDashboard = () => {
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    values: [45, 60, 35, 55, 70]
  };

  const revenueData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D'],
    values: [120, 85, 65, 110]
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Simple Data Visualization</h2>
      
      <div className="grid gap-6">
        <SimpleDataViz 
          data={salesData} 
          title="Monthly Sales" 
        />
        
        <SimpleDataViz 
          data={revenueData} 
          title="Product Revenue" 
        />
      </div>
    </div>
  );
};

export default DataDashboard;