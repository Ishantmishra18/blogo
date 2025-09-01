import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useUser } from '../Context/userContext';


const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', form);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white">
      <div className='h-screen w-[40vw] rounded-r-4xl md:block hidden'>
        <img src="https://m.media-amazon.com/images/I/81m3cKkCszL.jpg" alt="" className=' object-cover h-full w-full'/>
    </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[90vw] md:w-[400px] items-center justify-center gap-6 p-8"
      >
        <h1 className="text-2xl md:text-4xl font-semibold text-gray-800 mb-2">
          Login to Travo
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-lg focus:bg-gray-200 focus:outline-none"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:bg-gray-200"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <p className="text-red-500 text-sm -mt-3">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-full hover:translate-y-1 cursor-pointer duration-200 transition"
        >
          Login
        </button>

        <div className="text-sm text-gray-600">
          <span>Don't have an account? </span>
          <Link
            to="/register"
            className="text-blue-500 hover:underline hover:text-blue-700"
          >
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;