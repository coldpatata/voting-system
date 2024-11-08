import { Link, useNavigate } from 'react-router-dom';
import { logo } from '../../assets/image/image';
import { FC, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const passwordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const saveToCookies = (accessToken: string, userType: string) => {
    Cookies.set('accessToken', accessToken, { expires: 7, secure: true });
    Cookies.set('userType', userType, { expires: 7, secure: true });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/userAuthentication/Login', {
        username,
        password,
      });

      //kwaon ang accesstoken ug role id na response sa endpoint
      const { accessToken, role_id } = response.data;

      // gi save nako sa cookies
      saveToCookies(accessToken, role_id);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      // Check if error is an AxiosError
      if (error instanceof AxiosError && error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white flex flex-col p-7 md:flex-row items-center justify-center w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
        <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
          <img
            src={logo}
            alt="Supreme Secondary Learner Government logo"
            className="rounded-lg shadow-lg w-3/4 md:w-full"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-8">Login</h1>
          <form className="w-3/4" onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="flex items-center justify-between shadow border rounded w-full py-2 px-3 text-gray-700 mb-3">
                <input
                  className="appearance-none leading-tight focus:outline-none focus:shadow-outline w-[calc(100%-11%)]"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={passwordVisibility}
                  aria-label={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>

              <p className="text-right text-gray-500 text-xs">
                <Link to="/forgot-password" className="hover:underline">
                  Forgot your password?
                </Link>
              </p>
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
            <div className="flex items-center justify-center">
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded focus:outline-none"
                type="button"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
