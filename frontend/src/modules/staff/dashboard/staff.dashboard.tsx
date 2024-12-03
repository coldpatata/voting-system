import { useEffect, useState } from 'react';
import Announcement from '../../../components/announcements/announcement';
import CustomMonthLayout from '../../../components/calendar/calendar';

interface AnnouncementData {
  announcement_id: number;
  title_header: string;
  time_date: string;
  image_url: string;
  description_text: string;
}

function DashboardPageStaff() {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/announcement/getAnnouncements');
        const result = await response.json();
        if (response.ok) {
          setAnnouncements(result.data);
        } else {
          console.error('Failed to fetch announcements:', result.message);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <>
      <div className="bg-gray-800 p-4 text-white">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <p className="text-sm">Welcome back, staff member!</p>
      </div>
      <div className="p-4">
        <div className="flex justify-between">
          <div className="w-2/3 flex flex-col space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <Announcement
                  key={announcement.announcement_id}
                  title={announcement.title_header}
                  description={announcement.description_text}
                  imageUrl={announcement.image_url}
                  date={new Date(announcement.time_date).toLocaleDateString()}
                />
              ))
            ) : (
              <p className="text-gray-600">No announcements available.</p>
            )}
          </div>
          <div className="ml-4 w-1/3">
            <CustomMonthLayout />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPageStaff;
