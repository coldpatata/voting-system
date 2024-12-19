import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

const ProfileHeader: FC = () => {
  const location = useLocation();

  
  const isAdmin = location.pathname.startsWith('/admin');
  const isStudent = location.pathname.startsWith('/student');
  const isStaff = location.pathname.startsWith('/staff');


  const links = isAdmin
    ? [
        { label: 'Password', path: '/admin/profile/password' },
        { label: 'User Account', path: '/admin/profile/user' },
      ]
    : isStaff
    ? [
        { label: 'Password', path: '/staff/profile/password' },
        { label: 'User Account', path: '/staff/profile/user' },
      ]
    : [
        { label: 'Password', path: '/student/profile/password' },
        { label: 'User Account', path: '/student/profile/user' },
      ];

  return (
    <>
      <div className="bg-blue-900 text-white p-4">
        <h1 className="text-xl">Profile Account</h1>
      </div>
      <div>
        <div className="bg-gray-200 p-4 md:flex lg:flex-row-reverse w-full gap-9">
          {links.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${isActive ? 'underline underline-offset-2' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
