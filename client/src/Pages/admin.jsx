import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';


const Admin = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState(null);
  const [posts, setPosts] = useState(null);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const correctPassword = 'admin';
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[88vh] flex items-center justify-center bg-gray-100 p-4">
        <form 
          onSubmit={handlePasswordSubmit} 
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm flex flex-col items-center space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-sm text-gray-500">Enter the admin password to view user data.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition transform hover:scale-105"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }


  if (!users || !posts) {
    return (
      <div className="min-h-[88vh] flex items-center justify-center text-xl text-gray-600">
        Loading admin data...
      </div>
    );
  }

  
 useEffect(() => {
    const fetchData = async() =>{
            const response = await api.get('/admin/getData')
            setUsers(response.data.users);
            setPosts(response.data.posts);
        }
    if(isAuthenticated){
        fetchData();
    }
 },[])

  return (
    <div className="min-h-[88vh] bg-gray-100 p-6 sm:p-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-10">Admin Dashboard</h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        users.map(user => (
          <div key={user._id} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 mb-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={user.profilePicture || `https://placehold.co/100x100/E5E7EB/4B5563?text=${user.username.charAt(0)}`}
                  alt={`${user.username}'s profile`} 
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md" 
                />
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">{user.username}</h3>
                  <p className="text-sm text-gray-500">User ID: <span className="font-mono text-gray-700">{user._id}</span></p>
                  <p className="text-sm text-gray-500">Email: {user.email}</p>
                </div>
              </div>
              <p className="mt-4 sm:mt-0 text-lg font-medium text-gray-700">
                Total Posts: <span className="text-blue-600">{postsByUser[user._id]?.length || 0}</span>
              </p>
            </div>

            <h4 className="text-lg font-semibold text-gray-700 mb-3">Posts by {user.username}:</h4>
            {postsByUser[user._id] && postsByUser[user._id].length > 0 ? (
              <div className="grid gap-4">
                {postsByUser[user._id].map(post => (
                  <div key={post._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h5 className="text-md font-bold text-gray-800 mb-1">{post.title}</h5>
                    <p className="text-sm text-gray-600">{post.description.substring(0, 100)}...</p>
                    <p className="text-xs text-gray-400 mt-2">
                      <span className="font-semibold">Post ID:</span> {post._id} | 
                      <span className="font-semibold ml-2">Created:</span> {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic pl-4">No posts found for this user.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Admin;
