import { FC } from 'react';
import CustomMonthLayout from '../../../components/calendar/calendar';
import Announcement from '../../../components/announcements/announcement';

const DashboardPage: FC = () => {
  return (
    <>
      <div className="bg-blue-900 p-4 text-white">
        <h1 className="text-xl">Good Day!</h1>
      </div>
      <div>
        <div className="flex justify-between p-2">
          <div className="flex flex-col space-y-4">
            <Announcement />
          </div>
          <div className="ml-auto">
            <CustomMonthLayout />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
