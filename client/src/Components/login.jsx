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
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white relative">
        <Link to='/' className="back absolute top-5 left-5 bg-gray-200 px-4 py-3 rounded-full">back to home</Link>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[90vw] md:w-[400px] items-center justify-center gap-6 p-8"
      >
        <h1 className="text-2xl md:text-4xl font-semibold text-gray-800 mb-2">
          Login to <span className='text-green-600'> eXanaly </span>
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