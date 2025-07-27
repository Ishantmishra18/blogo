import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const AdminPanel = () => {
  const [data, setData] = useState({ users: [], files: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get('/admin/data');
        setData(response.data.data);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Summary Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 p-4 bg-gray-50 rounded-lg min-w-[200px]">
          <h3 className="font-medium">Total Users</h3>
          <p className="text-2xl mt-2">{data.users.length}</p>
        </div>
        <div className="flex-1 p-4 bg-gray-50 rounded-lg min-w-[200px]">
          <h3 className="font-medium">Total Files</h3>
          <p className="text-2xl mt-2">{data.files.length}</p>
        </div>
      </div>

      {/* All Files Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Files</h2>
        <div className="bg-white rounded-lg shadow-sm p-4">
          {data.files.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3">File Name</th>
                    <th className="text-left p-3">Uploaded By</th>
                    <th className="text-left p-3">Upload Date</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {data.files.map(file => (
                    <tr key={file._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">{file.title}</td>
                      <td className="p-3">{file.uploadedBy.username}</td>
                      <td className="p-3">{new Date(file.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">{file.fileType}</td>
                      <td className="p-3">{(file.size / 1024).toFixed(2)} KB</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500">
              No files found
            </div>
          )}
        </div>
      </div>

      {/* Users Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Users and Their Files</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.users.map(user => {
            const userFiles = data.files.filter(file => file.uploadedBy._id === user._id);
            
            return (
              <div key={user._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium">{user.username}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {userFiles.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {userFiles.map(file => (
                      <div key={file._id} className="p-3">
                        <p className="font-medium">{file.title}</p>
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <span>{file.fileType}</span>
                          <span>{(file.size / 1024).toFixed(2)} KB</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(file.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No files uploaded
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;