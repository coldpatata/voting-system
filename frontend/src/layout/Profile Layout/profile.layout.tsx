import { Outlet } from 'react-router-dom';
import ProfileHeader from './profile-header.layout';

const ProfileLayout: React.FC = () => {
  return (
    <>
      <div className="">
        <ProfileHeader />

        <Outlet />
      </div>
    </>
  );
};

export default ProfileLayout;
