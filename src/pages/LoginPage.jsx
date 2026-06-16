import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch {
      toast.error('Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0] py-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md">
        <h2 className="text-3xl font-heading text-center mb-6">Welcome Back!</h2>
        <p className="text-center text-sm text-gray-500 mb-8">Login here:</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Your email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email address" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#b8a28c]" required />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Your password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#b8a28c]" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#1a1a1a] text-white py-3 rounded-full hover:bg-[#b8a28c] transition disabled:opacity-50">Login</button>
        </form>
        <p className="text-center text-sm mt-6">Don't have an account? <Link to="/register" className="text-[#b8a28c] hover:underline">Register now.</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;