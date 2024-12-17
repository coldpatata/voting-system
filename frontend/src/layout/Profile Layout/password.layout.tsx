import { FC, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const PasswordLayout: FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const uid = Cookies.get('uid');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    try {
      const response = await axios.put('http://localhost:5000/api/userAuthentication/ChangePassword', {
        user_id: uid,
        currentPassword,
        newPassword,
      });

      setSuccess(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="bg-blue-100 text-blue-700 p-4 rounded mb-6 flex items-center">
          <i className="fas fa-info-circle mr-2"></i>
          <span>Update your account's password securely.</span>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <i className="fas fa-eye-slash absolute right-3 top-3 text-gray-500"></i>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <i className="fas fa-eye-slash absolute right-3 top-3 text-gray-500"></i>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <i className="fas fa-eye-slash absolute right-3 top-3 text-gray-500"></i>
            </div>
          </div>
          <button
            type="submit"
            className="bg-yellow-400 text-gray-800 px-4 py-2 rounded hover:bg-yellow-500"
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};

export default PasswordLayout;
