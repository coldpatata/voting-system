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
        <div className="p-4 flex flex-col lg:flex-row gap-4">
          {/* Announcements Section */}
          <div className="flex-1">
            <Announcement />
          </div>

          {/* Calendar Section */}
          <div className="w-full lg:w-1/3">
            <CustomMonthLayout />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
