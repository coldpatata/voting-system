import CustomMonthLayout from '../../../components/calendar/calendar';
import Announcement from '../../../components/announcements/announcement';

function DashboardPageStaff() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-800 p-4 text-white">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <p className="text-sm">Welcome back, staff member!</p>
      </div>

      {/* Main Content */}
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
  );
}

export default DashboardPageStaff;
