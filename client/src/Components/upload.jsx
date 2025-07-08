import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setColumns(res.data.columns);
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className='mt-10 bg-amber-500 p-8 '>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} className='bg-blue-500 px-5 py-2 rounded-2xl text-white font-bold cursor-pointer hover:translate-y-1 duration-300 '>Upload</button>
      {columns.length > 0 && (
        <select>
          {columns.map((col) => (
            <option key={col}>{col}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Upload;