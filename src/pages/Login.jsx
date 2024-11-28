'use client';

import { useState } from 'react';
import axiosInstance from '../config/axiosconfig'; // Adjust the path to your axios instance
import { toast } from 'react-hot-toast';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/login', { email, password });

      if (response.status === 200) {
        toast.success('Login successful!', {
          position: 'top-right',
          duration: 3000, // Toast disappears after 3 seconds
        });
        console.log('User data:', response.data);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Login failed', {
          position: 'top-right',
          duration: 3000,
        });
        console.error('Error response:', error.response);
      } else {
        toast.error('An error occurred. Please try again.', {
          position: 'top-right',
          duration: 3000,
        });
        console.error('Error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <h2 className="text-3xl font-bold">Welcome to To-do app</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in to continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
