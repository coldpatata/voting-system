import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { logo } from '../../assets/image/image';
import Cookies from 'js-cookie';

const ResetPassword: FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const email = Cookies.get('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Send POST request to the ResetPassword endpoint
      const response = await axios.post('http://localhost:5000/api/userAuthentication/ResetPassword', {
        email: email,
        password,
      });

      if (response.status === 200) {
        setSuccess(response.data.message);
        alert("PASSWORD UPDATED")
        setError('');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
      setSuccess('');
    }
  };

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen ">
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center md:items-start w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
          <div className="flex-shrink-0 mb-6 md:mb-0">
            <img
              alt="Supreme Secondary Learner Government logo"
              className="rounded-lg shadow-lg w-64 h-64 md:w-80 md:h-80"
              src={logo}
            />
          </div>
          <div className="w-full md:ml-8 mt-6 text-center md:text-left ">
            <h1 className="text-2xl text-center font-bold mb-8">Reset Password</h1>

            <form onSubmit={handleSubmit}>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {success && <p className="text-green-500 mb-4">{success}</p>}
              <div className="mb-4">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <input
                    className="w-full py-2 px-3 text-gray-700 focus:outline-none"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <input
                    className="w-full py-2 px-3 text-gray-700 focus:outline-none"
                    placeholder="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-lg"
                type="submit"
              >
                Reset Password
              </button>
            </form>
            <div className="mt-4">
              <a className="">
                <p className="text-center">
                  Go back to{' '}
                  <Link to="/" className="text-blue-600 hover:text-blue-900">
                    Sign In
                  </Link>
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
