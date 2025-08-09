import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useUser } from '../Context/userContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Chart from './chart';
import ConfirmCard from './confirmCard';
import { useTheme } from '../Context/themeContext';
import { IoSunny, IoMoon } from "react-icons/io5";
import { IoHomeSharp } from "react-icons/io5";
import Loader from './loading'; 

const Profile = () => {
  const { user, setUser } = useUser();
  const [userHistory, setUserHistory] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const chartContainers = useRef([]);
  const [showConfirmation, setshow] = useState(false);
  const [showDet, setShowDet] = useState({text:'', title:'', delId:''});
  const { isDark, toggleTheme } = useTheme();
  const [del, setDel] = useState('');
  const [sortKey, setSortKey] = useState('time');

  const handleLogout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    navigate('/login');
  };

  const handleDelAccount = async () => {
    try {   
      await api.delete('/auth/delete');
      setUser(null);
      setShowDet(null);
      navigate('/login');
    } catch (error) {  
      console.error('Error deleting account:', error);
    }
  }

  const handleDel = async (id) => {
    try {
      await api.delete(`/files/delete/${id}`);
      setUserHistory(prevHistory => {
        const updatedHistory = prevHistory.filter(item => item._id !== id);
        return sortData(updatedHistory, sortKey);
      });
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setshow(false);
      setShowDet({text: '', title: '', delId: ''});
      setDel('');
    }
  }

  const sortData = (data, key) => {
    return [...data].sort((a, b) => {
      if (key === 'alphabet') {
        return a.title.localeCompare(b.title);
      } else if (key === 'size') {
        return a.size - b.size;
      } else if (key === 'time') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });
  };

  const sortedHistory = useMemo(() => {
    return sortData(userHistory, sortKey);
  }, [userHistory, sortKey]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/auth/history');
        setUserHistory(res.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.history && user.history.length > 0) {
      fetchHistory();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const toggleDetails = (index) => {
    if (expandedItem === index) {
      setExpandedItem(null);
    } else {
      setExpandedItem(index);
      setTimeout(() => {
        chartContainers.current[index]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 300); 
    }
  };

  return (
    <div className={`min-h-screen relative ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-green-50 to-gray-50'}`}>
      {showConfirmation && (
        <ConfirmCard 
          close={() => setshow(false)}
          onClick={() => {
            if (del === 'file') {
              handleDel(showDet.delId);
            } else {
              handleDelAccount();
            }
          }}
          text={showDet.text} 
          name={showDet.title} 
        />
      )}
      
      {/* Header */}
      <header className={`shadow-sm sticky z-40 top-0 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 sm:px-6 lg:px-8 flex justify-between items-center gap-3 sm:gap-0">
          <Link to='/' className={`flex items-center p-2 rounded-full text-lg font-semibold ${isDark ? 'text-white bg-gray-600' : 'text-gray-800 bg-gray-100'} transition-colors hover:text-green-600`}>
            <IoHomeSharp />
          </Link>

          <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full mx-auto sm:mx-0 ${
                isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors`}
              aria-label="Toggle theme"
            >
              {isDark ? <IoSunny className="w-5 h-5" /> : <IoMoon className="w-5 h-5" />}
            </button>

            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm sm:text-base text-white rounded-lg cursor-pointer shadow-md bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              >
                Logout
              </button>
              <button
                className="px-3 py-2 text-sm whitespace-nowrap sm:text-base bg-red-600 text-white cursor-pointer rounded-lg hover:bg-red-700 transition-all shadow-md flex items-center justify-center w-full sm:w-auto"
                onClick={() => setshow(true) & setShowDet({ delId: user._id, title:user.username , text:'are you sure you want to delete you account' , fun:()=>handleDelAccount })}
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* User Info Card */}
        <div className={`rounded-xl shadow-lg p-6 mb-8 border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className={`h-20 w-20 rounded-full flex items-center justify-center shadow-inner ${
                isDark ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-green-100 to-green-200'
              }`}>
                <span className={`text-3xl font-bold ${
                  isDark ? 'text-gray-300' : 'text-green-800'
                }`}>
                  {user?.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {user?.username || 'User'}
                </h2>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {user?.email}
                </p>
                {user?.createdAt && (
                  <p className={`text-sm mt-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <Link
              to="/upload"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-md flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Upload New File
            </Link>
          </div>
        </div>

        {/* Upload History */}
        <div className={`rounded-xl relative shadow-lg md:p-6 p-2 border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Your Upload History
            </h2>
            {!isLoading && userHistory.length > 0 && (
              <div className="flex gap-5">
                <select 
                  value={sortKey} 
                  onChange={(e) => setSortKey(e.target.value)}
                  className={`
                    p-2 rounded-lg border transition-colors
                    ${isDark ? 
                      'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 
                      'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
                    }
                    focus:outline-none focus:ring-2 
                    ${isDark ? 'focus:ring-blue-500' : 'focus:ring-blue-300'}
                  `}
                >
                  <option value="alphabet">by Alphabet</option>
                  <option value="size">by Size</option>
                  <option value="time">by Time</option>
                </select>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {userHistory.length} {userHistory.length === 1 ? 'file' : 'files'}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {isLoading ? (
           
              <Loader />
            
          ) : userHistory.length > 0 ? (
            <div className="space-y-4">
              {sortedHistory.map((item, index) => (
                <div 
                  key={index} 
                  className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border ${
                    isDark ? 'bg-gray-700 border-gray-600 hover:border-gray-500' : 'bg-white border-gray-100'
                  }`}
                >
                  {/* File header with delete button */}
                  <div className="flex justify-between items-start md:p-5 p-2">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isDark ? 'bg-gray-600' : 'bg-green-50'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className={`font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.title || 'Untitled File'}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Uploaded {new Date(item.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Modern delete button */}
                    <button 
                      onClick={() => setshow(true) & setShowDet({ delId: item._id, title: item.title , text:'are you sure you want to delete this file'}) & setDel('file')}
                      className={`cursor-pointer p-1 rounded-full hover:bg-opacity-20 transition-colors ${
                        isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-900' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                      aria-label="Delete file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* File metadata */}
                  <div className="px-5 pb-3 flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.size} KB
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.summary.totalRows} rows
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Processed' ? 
                        isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800' : 
                      item.status === 'Processing' ? 
                        isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800' : 
                        isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status || 'Processed'}
                    </span>
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => toggleDetails(index)}
                    className={`w-full cursor-pointer px-5 py-3 text-sm font-medium flex items-center justify-between border-t ${
                      isDark ? 'border-gray-700 text-green-400 hover:text-green-300' : 'border-gray-100 text-green-600 hover:text-green-800'
                    } transition-colors`}
                  >
                    <span>
                      {expandedItem === index ? 'Hide visualization' : 'Show visualization'}
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 transition-transform ${expandedItem === index ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Chart container */}
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      expandedItem === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-5 pt-0">
                      <Chart data={item} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 mx-auto ${
                isDark ? 'text-gray-600' : 'text-gray-300'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className={`mt-4 text-lg font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                No files uploaded yet
              </h3>
              <p className={`mt-1 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Get started by uploading your first Excel file
              </p>
              <Link
                to="/upload"
                className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Upload File
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;