import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] w-full">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-700 text-lg font-medium">Loading...</p>
    </div>
  );
};

export default Loader;