import { FC } from 'react';
import CustomMonthLayout from '../../../components/calendar/calendar';
import Announcement from '../../../components/announcements/announcement';
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
            <table className="min-w-full text-center border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border p-2">President</th>
                  <th className="border p-2">V-President</th>
                  <th className="border p-2">Secretary</th>
                  <th className="border p-2">Treasurer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Person 1</td>
                  <td className="border p-2">Person 1</td>
                  <td className="border p-2">Person 1</td>
                  <td className="border p-2">Person 1</td>
                </tr>
                <tr>
                  <td className="border p-2">Person 2</td>
                  <td className="border p-2">Person 2</td>
                  <td className="border p-2">Person 2</td>
                  <td className="border p-2">Person 2</td>
                </tr>
                <tr>
                  <td className="border p-2">Person 3</td>
                  <td className="border p-2">Person 3</td>
                  <td className="border p-2">Person 3</td>
                  <td className="border p-2">Person 3</td>
                </tr>
              </tbody>
            </table>
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
