import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser, changePassword, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    address: user?.address || '',
    phone_number: user?.phone_number || '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(form);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      await changePassword(passwordData.current_password, passwordData.new_password);
      toast.success('Password changed successfully');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <h1 className="text-3xl font-heading mb-8">User Profile</h1>

      {/* Profile Information Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
        {editing ? (
          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-1 focus:ring-[#b8a28c] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-1 focus:ring-[#b8a28c] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-1 focus:ring-[#b8a28c] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-1 focus:ring-[#b8a28c] focus:outline-none"
                  placeholder="123 Main St, City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone_number}
                  onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-1 focus:ring-[#b8a28c] focus:outline-none"
                  placeholder="+1234567890"
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    // Reset form to current user data
                    setForm({
                      first_name: user?.first_name || '',
                      last_name: user?.last_name || '',
                      email: user?.email || '',
                      address: user?.address || '',
                      phone_number: user?.phone_number || '',
                    });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong className="text-sm text-gray-500">First Name</strong>
                <p className="text-lg font-medium">{user?.first_name || 'N/A'}</p>
              </div>
              <div>
                <strong className="text-sm text-gray-500">Last Name</strong>
                <p className="text-lg font-medium">{user?.last_name || 'N/A'}</p>
              </div>
            </div>
            <div>
              <strong className="text-sm text-gray-500">Email</strong>
              <p className="text-lg font-medium">{user?.email}</p>
            </div>
            <div>
              <strong className="text-sm text-gray-500">Address</strong>
              <p className="text-lg font-medium">{user?.address || 'Not provided'}</p>
            </div>
            <div>
              <strong className="text-sm text-gray-500">Phone Number</strong>
              <p className="text-lg font-medium">{user?.phone_number || 'Not provided'}</p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => setEditing(true)}
                className="btn-primary"
              >
                Update Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-heading mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                value={passwordData.current_password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, current_password: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-1 focus:ring-[#b8a28c] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, new_password: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-1 focus:ring-[#b8a28c] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirm_password: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-1 focus:ring-[#b8a28c] focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={passwordLoading}
              className="btn-primary"
            >
              {passwordLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Optional logout button outside */}
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to logout?')) logout();
          }}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;