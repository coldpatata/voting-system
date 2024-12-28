import CustomMonthLayout from '../../../components/calendar/calendar';
import Announcement from '../../../components/announcements/announcement';
import CardBox from '../../../components/card-box/card-box';
import { useEffect, useState } from 'react';
import Header from '../../../components/header/header';

function DashboardPageStaff() {
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
  return (
    <>
    <header/>
      <div className="p-4 flex flex-col lg:flex-row gap-4">
        <div className="p-4 flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="card grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
              <CardBox title="No. of Candidates" value={0} />
              <CardBox title="No. of Ballots" value={0} />
              <CardBox title="No. of Students" value={totalStudents} />
            </div>
            <Announcement />
          </div>

          <div className="w-full lg:w-1/3">
            <CustomMonthLayout />
          </div>
        </div>
      </div>
    
      </>
  );
}

export default DashboardPageStaff;
