import { FC } from 'react';
import CustomMonthLayout from '../../../components/calendar/calendar';
import Announcement from '../../../components/announcements/announcement';
import VoteTally from '../../../components/votetally'; // Import VoteTally

const DashboardPageStudent: FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-900 p-4 text-white">
        <h1 className="text-xl">Good Day!</h1>
      </div>

      <div className="flex p-6">
        <div className="flex-1 space-y-6">
          {/* Announcements Section */}
          <div className="flex-1">
            <Announcement />
          </div>

          {/* Vote Tally Section */}
          <div className="bg-white shadow-lg rounded-md p-4">
            <h2 className="bg-blue-900 text-white text-center py-2 rounded-t-md">
              Vote Tally
            </h2>
            {/* Use the VoteTally component here, pass the ballotId prop */}
            <VoteTally ballotId={1} />{' '}
            {/* Replace '1' with the actual ballot ID */}
          </div>
        </div>

        {/* Right Column for Calendar */}
        <div className="w-1/4 ml-6">
          <CustomMonthLayout />
        </div>
      </div>
    </div>
  );
};

export default DashboardPageStudent;
