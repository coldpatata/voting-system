import { FC } from 'react';

const ProfileLayout: FC = () => {
  return (
    <>
      <div className="bg-blue-900 text-white p-4">
        <h1 className="text-xl">Profile Account</h1>
      </div>
      <div className="">
        <div className="bg-gray-200 p-4 md:flex lg:flex-row-reverse w-full  gap-9 ">
          <a href="">Change Password</a>
          <a href="" className="underline">
            User Account
          </a>
        </div>
      </div>
    </>
  );
};

export default ProfileLayout;
