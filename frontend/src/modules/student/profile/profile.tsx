import { FC } from 'react';
import ProfileLayout from '../../../layout/Profile Layout/profile-header.layout';
import UserLayout from '../../../layout/Profile Layout/user.layout';

const ProfilePage: FC = () => {
  return (
    <>
      {' '}
      <div className="p-4">
        <ProfileLayout />

        <UserLayout />
      </div>
    </>
  );
};

export default ProfilePage;
