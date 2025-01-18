import { FC, useEffect, useState } from 'react';
import CustomMonthLayout from '../../../components/calendar/calendar';
import Announcement from '../../../components/announcements/announcement-modal';
import CardBox from '../../../components/card-box/card-box';
import Header from '../../../components/header/header';

const DashboardPage: FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  const fetchStudentCount = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/users/count/students'
      );
      const data = await response.json();
      setTotalStudents(data.totalStudents || 0);
    } catch (error) {
      console.error('Error fetching student count:', error);
    }
  };

  useEffect(() => {
    fetchStudentCount();
  }, []);

  const fetchUserCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/count');
      const data = await response.json();
      setTotalUsers(data.totalUsers || 0);
    } catch (error) {
      console.error('Error fetching total users count:', error);
    }
  };

  useEffect(() => {
    fetchUserCount();
  }, []);

  return (
    <>
      <Header />

      <div className="p-4 flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="card grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
            <CardBox title="No. of Candidates" value={0} />
            <CardBox title="No. of Ballots" value={0} />
            <CardBox title="No. of Students" value={totalStudents} />
            <CardBox title="No. of Accounts" value={totalUsers} />
          </div>

          {/* Announcement Section */}
          <Announcement />
        </div>

        {/* Calendar Section */}
        <div className="w-full lg:w-1/3">
          <CustomMonthLayout />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
