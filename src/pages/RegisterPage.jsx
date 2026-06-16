import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ email: '', password: '', re_password: '', first_name: '', last_name: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.re_password) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const { re_password, ...data } = form;
      await authService.register(data);
      toast.success('Registered! Please login.');
      navigate('/login');
    } catch { toast.error('Registration failed'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0] py-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md">
        <h2 className="text-3xl font-heading text-center mb-6">Welcome!</h2>
        <p className="text-center text-sm text-gray-500 mb-8">Register here:</p>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Your name</label><input type="text" name="first_name" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} placeholder="Enter name" className="w-full border border-gray-300 rounded-lg px-4 py-3" required /></div>
            <div><label className="block text-sm font-medium mb-1">Your lastname</label><input type="text" name="last_name" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} placeholder="Enter lastname" className="w-full border border-gray-300 rounded-lg px-4 py-3" /></div>
          </div>
          <div className="mb-4"><label className="block text-sm font-medium mb-1">Your email</label><input type="email" name="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Enter email address" className="w-full border border-gray-300 rounded-lg px-4 py-3" required /></div>
          <div className="mb-4"><label className="block text-sm font-medium mb-1">Your password</label><input type="password" name="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Enter password" className="w-full border border-gray-300 rounded-lg px-4 py-3" required /></div>
          <div className="mb-6"><label className="block text-sm font-medium mb-1">Confirm password</label><input type="password" name="re_password" value={form.re_password} onChange={e => setForm({...form, re_password: e.target.value})} placeholder="Confirm password" className="w-full border border-gray-300 rounded-lg px-4 py-3" required /></div>
          <button type="submit" disabled={loading} className="w-full bg-[#1a1a1a] text-white py-3 rounded-full hover:bg-[#b8a28c] transition disabled:opacity-50">Register</button>
        </form>
        <p className="text-center text-sm mt-6">Already have an account? <Link to="/login" className="text-[#b8a28c] hover:underline">Login now.</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;