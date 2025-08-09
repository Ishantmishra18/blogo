import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { FiLock, FiUnlock, FiUsers, FiFile, FiChevronDown, FiChevronUp, FiSun, FiMoon, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '../Context/themeContext';
import ConfirmCard from './confirmCard';

const AdminPanel = () => {
  const [data, setData] = useState({ users: [], files: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [access, setAccess] = useState(false);
  const [pass, setPass] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);
  const { isDark, toggleTheme } = useTheme();
  const [showConfirmation, setshow] = useState(false);
  const [showDet, setShowDet] = useState({ text: '', title: '', delId: '', type: '' });
  const [del, setDel] = useState('');

  const adminPass = 'admin';

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/data');
        setData(response.data.data);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    if (access) {
      fetchAdminData();
      alert("Welcome to Admin Panel");
    }
  }, [access]);

  const handleDeleteAccount = async (userId) => {
    try {
      await api.delete(`/admin/delete-user/${userId}`);
      setData(prev => ({
        ...prev,
        users: prev.users.filter(user => user._id !== userId),
        files: prev.files.filter(file => file.uploadedBy._id !== userId)
      }));
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setshow(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await api.delete(`/admin/delete-file/${fileId}`);
      setData(prev => ({
        ...prev,
        files: prev.files.filter(file => file._id !== fileId)
      }));
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setshow(false);
    }
  };

  const handleCheck = (e) => {
    e.preventDefault();
    if (pass === adminPass) {
      setAccess(true);
      setPass('');
    } else {
      alert('Wrong password');
    }
  };

  const toggleUserFiles = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const showDeleteConfirmation = (id, name, type) => {
    setshow(true);
    setShowDet({
      text: `Are you sure you want to delete this ${type}?`,
      title: name,
      delId: id,
      type: type
    });
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDark ? 'border-green-400' : 'border-green-600'}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col justify-center items-center h-screen p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {showConfirmation && (
          <ConfirmCard 
            close={() => setshow(false)}
            onClick={() => {
              if (showDet.type === 'file') {
                handleDeleteFile(showDet.delId);
              } else if (showDet.type === 'user') {
                handleDeleteAccount(showDet.delId);
              }
            }}
            text={showDet.text} 
            name={showDet.title} 
          />
        )}
        <div className={`p-6 rounded-lg shadow-md max-w-md w-full text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className={`mt-2 font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className={`px-4 py-2 ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white rounded transition`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!access) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`w-full max-w-md p-8 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center mb-6">
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'}`}>
              <FiLock className="h-6 w-6" />
            </div>
            <h2 className={`mt-3 text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Admin Portal</h2>
            <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Enter admin password to continue</p>
          </div>
          
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition ${
                  isDark ? 'bg-gray-700 border-gray-600 focus:border-green-500 focus:ring-green-500 text-white' : 
                  'bg-white border-gray-300 focus:border-green-500 focus:ring-green-500 text-gray-800'
                }`}
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center ${
                !pass ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              } text-white`}
              disabled={!pass}
            >
              <FiUnlock className="mr-2" />
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50'}`}>
      {showConfirmation && (
        <ConfirmCard 
          close={() => setshow(false)}
          onClick={() => {
            if (showDet.type === 'file') {
              handleDeleteFile(showDet.delId);
            } else if (showDet.type === 'user') {
              handleDeleteAccount(showDet.delId);
            }
          }}
          text={showDet.text} 
          name={showDet.title} 
        />
      )}
      
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Admin Dashboard</h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDark ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className={`p-4 rounded-lg shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'}`}>
                <FiUsers className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <h3 className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Users</h3>
                <p className={`text-2xl mt-1 font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{data.users.length}</p>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-lg shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'}`}>
                <FiFile className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <h3 className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Files</h3>
                <p className={`text-2xl mt-1 font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{data.files.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className={`rounded-xl shadow-sm overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Users</h2>
          </div>
          
          <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {data.users.map(user => {
              const userFiles = data.files.filter(file => file.uploadedBy._id === user._id);
              
              return (
                <div key={user._id} className={`${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} transition-colors`}>
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleUserFiles(user._id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{user.username}</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                        {userFiles.length} files
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showDeleteConfirmation(user._id, user.username, 'user');
                        }}
                        className={`ml-3 p-1 rounded-full hover:bg-opacity-20 transition-colors ${
                          isDark ? 'text-red-400 hover:bg-red-900' : 'text-red-500 hover:bg-red-100'
                        }`}
                        aria-label="Delete user"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                      {expandedUser === user._id ? (
                        <FiChevronUp className={`ml-3 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      ) : (
                        <FiChevronDown className={`ml-3 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      )}
                    </div>
                  </div>
                  
                  {expandedUser === user._id && (
                    <div className={`transition-all duration-300 ease-in-out ${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
                      <div className="px-4 pb-4">
                        <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Uploaded Files</h4>
                        
                        {userFiles.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className={`${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                                  <th className={`text-left p-3 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Title</th>
                                  <th className={`text-left p-3 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Date</th>
                                  <th className={`text-left p-3 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Type</th>
                                  <th className={`text-left p-3 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Size</th>
                                  <th className={`text-left p-3 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {userFiles.map(file => (
                                  <tr 
                                    key={file._id} 
                                    className={`${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'} border-b`}
                                  >
                                    <td className="p-3">{file.title}</td>
                                    <td className="p-3">{new Date(file.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">
                                      <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>
                                        {file.fileType}
                                      </span>
                                    </td>
                                    <td className="p-3">{(file.size / 1024).toFixed(2)} KB</td>
                                    <td className="p-3">
                                      <button
                                        onClick={() => showDeleteConfirmation(file._id, file.title, 'file')}
                                        className={`p-1 rounded-full hover:bg-opacity-20 transition-colors ${
                                          isDark ? 'text-red-400 hover:bg-red-900' : 'text-red-500 hover:bg-red-100'
                                        }`}
                                        aria-label="Delete file"
                                      >
                                        <FiTrash2 className="h-5 w-5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className={`py-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <FiFile className="h-8 w-8 mx-auto opacity-50" />
                            <p className="mt-2">No files uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;