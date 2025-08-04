import React from 'react';
import { Spin } from 'antd';

const Loading = () => {
  return (
    <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-50 backdrop-blur-sm">
      <Spin 
        size="large"
        className="custom-spin"
        style={{
          transform: 'scale(2)',
          '--antd-wave-shadow-color': '#10B981',
          '--spin-color': '#10B981'
        }}
      />
    </div>
  );
};



export default Loading;