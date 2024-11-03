import { FC } from 'react';
import CustomMonthLayout from '../../../components/calendar/calendar';
import Announcement from '../../../components/announcements/announcement';
import pic from '../../../assets/image/jpg/error.jpg';
const DashboardPage: FC = () => {
  return (
    <div>
      <div className="flex justify-between p-2">
        <Announcement
          title="ANNOUNCEMENT TITLE"
          description="DESCRIPTION"
          imageUrl={pic}
          date="02-20-2002"
        ></Announcement>
        <div className="ml-auto">
          <CustomMonthLayout />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
