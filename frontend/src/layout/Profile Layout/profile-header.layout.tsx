import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

const ProfileHeader: FC = () => {
  const location = useLocation();

  return (
    <>
      <div className="bg-blue-900 text-white p-4">
        <h1 className="text-xl">Profile Account</h1>
      </div>
      <div className="">
        <div className="bg-gray-200 p-4 md:flex lg:flex-row-reverse w-full gap-9">
          {[
            { label: 'Password', path: '/admin/profile/password' },
            { label: 'User   Account', path: '/admin/profile/user' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${
                location.pathname.startsWith(item.path)
                  ? 'underline underline-offset-2'
                  : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
