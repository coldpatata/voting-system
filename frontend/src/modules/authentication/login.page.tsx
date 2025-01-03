import { Link, useNavigate } from 'react-router-dom';
import { logo } from '../../assets/image/image';
import { FC, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');

  const passwordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const saveToCookies = (
    accessToken: string,
    userType: string,
    uid: string,
    profile_url: string,
    first_name: string
  ) => {
    Cookies.set('accessToken', accessToken, { expires: 7, secure: true });
    Cookies.set('userType', userType, { expires: 7, secure: true });
    Cookies.set('username', username, { expires: 7, secure: true });
    Cookies.set('uid', uid, { expires: 7, secure: true });
    Cookies.set('profile_url', profile_url, { expires: 7, secure: true });
    Cookies.set('first_name', first_name, { expires: 7, secure: true });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/userAuthentication/Login',
        {
          username,
          password,
        }
      );

      const { accessToken, role_id, uid, profile_url, first_name } =
        response.data;
      console.log(response.data);
      saveToCookies(accessToken, role_id, uid, profile_url, first_name);

      Swal.fire({
        title: 'Success!',
        text: 'You have successfully logged in.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      switch (role_id) {
        case 1:
          navigate('/student'); // Navigate to Admin Dashboard
          break;
        case 2:
          navigate('/admin'); // Navigate to Trainer Dashboard
          break;
        case 3:
          navigate('/staff'); // Navigate to Member Dashboard
          break;
        default:
          navigate('/'); // Default case if role_id doesn't match
          break;
      }
    } catch (error) {
      Swal.fire({
        title: 'Login Failed',
        text:
          error instanceof AxiosError && error.response?.data?.error
            ? error.response.data.error
            : 'Login failed. Please try again.',
        icon: 'error',
        confirmButtonText: 'Retry',
        allowOutsideClick: false,
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
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
                onKeyDown={handleKeyDown}
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
                  onKeyDown={handleKeyDown}
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
