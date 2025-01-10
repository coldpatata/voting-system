import React, { useState } from 'react';
import axios from 'axios';

interface ResetAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

const ResetAccount: React.FC<ResetAccountModalProps> = ({
  isOpen,
  onClose,
  username,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleResetPassword = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/accountReset',
        { username: username }
      );

      if (response?.status === 200) {
        alert(`Password successfully reset for username: ${username}`);
        onClose();
      } else {
        throw new Error('Failed to reset the password. Please try again.');
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        'Unexpected error occurred. Please try again later.';
      setError(errorMessage);
      console.error('Error resetting password:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-80">
        <div className="bg-blue-700 text-white text-lg font-bold p-4 rounded-t-lg">
          Edit Account
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              readOnly
              className="w-full bg-gray-200 text-gray-700 p-2 rounded-md"
              aria-label="Username"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Password</label>
            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              className={`w-full py-2 rounded-md ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-yellow-400 hover:bg-yellow-500 text-black font-semibold'
              }`}
              aria-label="Reset Password"
            >
              {isLoading ? (
                <span className="animate-spin">...</span>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
            aria-label="Close"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetAccount;
