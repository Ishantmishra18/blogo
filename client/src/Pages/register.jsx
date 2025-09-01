import React, { useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc"; // Optional: Google icon

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      alert("Registered successfully! Now login.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/auth/google'; //not used a tag becuase of external url from the web
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[90vw] md:w-[400px] items-center justify-center gap-6 p-8"
      >
        <h1 className="text-2xl md:text-4xl font-semibold text-gray-800 mb-2">
          Create an Account
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
          Register
        </button>

        <div className="text-sm text-gray-600">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="text-blue-500 hover:underline hover:text-blue-700"
          >
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;