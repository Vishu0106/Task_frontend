import { useState } from 'react';
import axiosInstance from '../config/axiosconfig';
import { toast } from 'react-hot-toast';
import  {useNavigate}  from 'react-router-dom';
import {Link} from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/users/register', { email, password });

      if (response.status === 201) {
        toast.success('Signup successful! You can now log in.', { position: 'top-right', duration: 3000 });
        navigate('/login');
        
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Signup failed', { position: 'top-right', duration: 3000 });
        console.error('Error response:', error.response);
      } else {
        toast.error('An error occurred. Please try again.', { position: 'top-right', duration: 3000 });
        console.error('Error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <h2 className="text-3xl font-bold">Sign up for To-do App</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
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
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
          <p className="text-sm text-center">
            Already have an account?{''}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
            </p>
        </form>
      </div>
    </div>
  );
}
