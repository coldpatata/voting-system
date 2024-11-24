import { FC, useState } from 'react';
import { logo } from '../../assets/image/image';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/email/send-email', {
        to: email,
        subject: 'Password Reset Request',
        text: 'Please use the link below to reset your password.',
        html: `<p>Please click <a href="http://localhost:5173/reset-password">here</a> to reset your password.</p>`
      });
      Cookies.set('email', email, { expires: 7, secure: true });
      setMessage('Password reset link has been sent to your email!');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send email.');
    }
  };

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center md:items-start w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
          <div className="flex-shrink-0 mb-6 md:mb-0">
            <img
              alt="Supreme Secondary Learner Government logo"
              className="rounded-lg shadow-lg w-64 h-64 md:w-80 md:h-80"
              src={logo}
            />
          </div>
          <div className="md:ml-8 mt-6 text-center md:text-left">
            <h1 className="text-2xl text-center font-bold mb-8">
              Forgot Password
            </h1>
            <h2 className="text-gray-700 mb-4">
              Just let us know your email address and a password reset link will
              be sent to your email.
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <input
                    className="w-full py-2 px-3 text-gray-700 focus:outline-none"
                    placeholder="@Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-lg"
                type="submit"
              >
                Email Link
              </button>
            </form>
            {message && (
              <p className="mt-4 text-green-600 text-center">{message}</p>
            )}
            {error && (
              <p className="mt-4 text-red-600 text-center">{error}</p>
            )}
            <div className="mt-4">
              <p className="text-center">
                Go back to{' '}
                <Link to="/" className="text-blue-600 hover:text-blue-900">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
