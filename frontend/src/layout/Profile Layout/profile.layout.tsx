import { Outlet } from 'react-router-dom';
import ProfileHeader from './profile-header.layout';

const ProfileLayout: React.FC = () => {
  return (
    <>
      <ProfileHeader />
      <div className="h-full w-full">
        <Outlet />
      </div>
    </>
  );
};

export default ProfileLayout;
