import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      login(data, data.token); // Save user data and token in context
      
      // Redirect based on role
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎟️</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">EventApp</h1>
          <p className="text-white text-opacity-90">Admin Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Sign In
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl mb-6 text-sm">
              <div className="flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@eventapp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full btn-primary py-3 text-base sm:text-lg"
            >
              🔐 Sign In
            </button>
          </form>
          
          <div className="text-center mt-6 text-sm text-gray-600">
            <Link to="/" className="text-purple-600 hover:text-purple-800 font-semibold transition-colors">
              ← Back to Homepage
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-white text-opacity-80 text-xs sm:text-sm">
            🔒 This is a secure admin portal. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}