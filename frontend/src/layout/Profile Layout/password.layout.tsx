import { FC } from 'react';

const PasswordLayout: FC = () => {
  return (
    <>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="bg-blue-100 text-blue-700 p-4 rounded mb-6 flex items-center">
          <i className="fas fa-info-circle mr-2"></i>
          <span>Update your account's profile information.</span>
        </div>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <i className="fas fa-eye-slash absolute right-3 top-3 text-gray-500"></i>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <i className="fas fa-eye-slash absolute right-3 top-3 text-gray-500"></i>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded"
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
