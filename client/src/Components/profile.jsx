import React from 'react';
import { useUser } from '../Context/userContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import Chart from './chart';

const Profile = () => {
  const { user } = useUser();
  const [userHistory, setUserHistory] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null); // Track which item is expanded
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await api.post('/auth/logout');
    navigate('/login');
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get('/auth/history');
      setUserHistory(res.data);
    };
    fetch();
  }, []);

  const toggleDetails = (index) => {
    if (expandedItem === index) {
      setExpandedItem(null); // Collapse if already expanded
    } else {
      setExpandedItem(index); // Expand the clicked item
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-green-600">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user?.username || 'User'}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            <Link
              to="/upload"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Upload New File
            </Link>
          </div>
        </div>

        {/* Upload History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Upload History</h2>
          
          {userHistory.length > 0 ? (
            <div className="space-y-4">
              {userHistory.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.fileName}</h3>
                      <p className="text-sm text-gray-500">
                        Uploaded on {new Date(item.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {item.status || 'Processed'}
                    </span>
                  </div>
                  <div className="mt-2 flex space-x-4 text-sm">
                    <span className="text-gray-600">{item.size} KB</span>
                    <span className="text-gray-600">{item.rows} rows processed</span>
                    <button
                      onClick={() => toggleDetails(index)}
                      className="text-green-600 hover:text-green-800 focus:outline-none"
                    >
                      {expandedItem === index ? 'Hide Details' : 'View Details'} →
                    </button>
                  </div>
                  {expandedItem === index && <Chart data={item} />}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No upload history yet</p>
              <Link
                to="/upload"
                className="mt-2 inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Upload Your First File
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;