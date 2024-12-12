import { useState } from 'react';
import { logo } from '../../assets/image/image';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); 


  const username = Cookies.get('username');

  const handleLogout = () => {
    // Remove the cookies
    Cookies.remove('accessToken');
    Cookies.remove('userType');
    Cookies.remove('username');

    navigate('/');
  };

  return (
    <>
      <button
        className="md:hidden p-4 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-6 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <button
          className="md:hidden mb-6 focus:outline-none"
          onClick={() => setIsOpen(false)}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex justify-around items-center mb-5">
          <img className="w-[3rem] h-[3rem] rounded-full" src={logo} />
          <p>
            {username
              ? `Hello ${username.charAt(0).toUpperCase() + username.slice(1)}`
              : 'Hello'}
          </p>
        </div>

        <nav className="text-sm">
          <Link
            to="/admin"
            className={`block py-2 px-3 rounded-md ${
              location.pathname === '/admin'
                ? 'bg-blue-600'
                : 'hover:bg-gray-700'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/candidate"
            className={`block py-2 px-3 rounded-md ${
              location.pathname === '/admin/candidate'
                ? 'bg-blue-600'
                : 'hover:bg-gray-700'
            }`}
          >
            Candidates
          </Link>
          <Link
            to="/admin/position"
            className={`block py-2 px-3 rounded-md ${
              location.pathname === '/admin/position'
                ? 'bg-blue-600'
                : 'hover:bg-gray-700'
            }`}
          >
            Position
          </Link>
          <Link
            to="/admin/ballot"
            className={`block py-2 px-3 rounded-md ${
              location.pathname === '/admin/ballot'
                ? 'bg-blue-600'
                : 'hover:bg-gray-700'
            }`}
          >
            Ballot
          </Link>
          <Link
            to="/admin/announcement"
            className={`block py-2 px-3 rounded-md ${
              location.pathname === '/admin/announcement'
                ? 'bg-blue-600'
                : 'hover:bg-gray-700'
            }`}
          >
            Announcements
          </Link>

          <div className="text-gray-400 text-sm mt-6">Manage Reports</div>

          <Link
            to="/admin/ballot-report"
            className={`block py-2 px-3 rounded-md ${
              location.pathname === '/admin/ballot-report'
                ? 'bg-blue-600'
                : 'hover:bg-gray-700'
            }`}
          >
            Ballot Report
          </Link>
          <Link
            to="/admin/feedbacks"
            className={`block py-2 px-3 rounded-md ${
              location.pathname === '/admin/feedbacks'
                ? 'bg-blue-600'
                : 'hover:bg-gray-700'
            }`}
          >
            Feedbacks
          </Link>

          <div className="text-gray-400 text-sm mt-6">Manage Users</div>

          <Link
            to="/admin/student-page"
            className={`block py-2 px-3 rounded-md ${
              location.pathname === '/admin/student-page'
                ? 'bg-blue-600'
                : 'hover:bg-gray-700'
            }`}
          >
            Students
          </Link>
          <Link
            to="/admin/staff-page"
            className={`block py-2 px-3 rounded-md ${
              location.pathname === '/admin/staff-page'
                ? 'bg-blue-600'
                : 'hover:bg-gray-700'
            }`}
          >
            Staff
          </Link>
          <Link
            to="/admin/accounts-page"
            className={`block py-2 px-3 rounded-md ${
              location.pathname === '/admin/accounts-page'
                ? 'bg-blue-600'
                : 'hover:bg-gray-700'
            }`}
          >
            Accounts
          </Link>

          <div className="text-gray-400 text-sm mt-6">Manage Account</div>

          <Link
            to="/admin/profile/user"
            className={`block py-2 px-3 rounded-md ${
              location.pathname === '/admin/profile/user' ||
              location.pathname === '/admin/profile/password'
                ? 'bg-blue-600'
                : 'hover:bg-gray-700'
            }`}
          >
            Profile
          </Link>
          <div className="m-7">
            <button
              onClick={handleLogout}
              className="block py-2 px-3 hover:bg-red-200 rounded-md"
            >
              <p className="text-red-700 font-bold text-xl text-center">
                Logout
              </p>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
