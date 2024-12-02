import { FC } from 'react';
import CustomMonthLayout from '../../../components/calendar/calendar';
import Announcement from '../../../components/announcements/announcement';
import pic from '../../../assets/image/jpg/error.jpg';
const DashboardPage: FC = () => {
  return (
    <>
      <div className="bg-blue-900 p-4 text-white">
        <h1 className="text-xl">Good Day!</h1>
      </div>
      <div>
        <div className="flex justify-between p-2">
          <Announcement
            title="ANNOUNCEMENT TITLE"
            description="description here"
            imageUrl={pic}
            date="02-20-2002"
          ></Announcement>

          <div className="ml-auto">
            <CustomMonthLayout />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
