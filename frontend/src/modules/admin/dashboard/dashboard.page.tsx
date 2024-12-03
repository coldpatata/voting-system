import { FC, useEffect, useState } from 'react';
import CustomMonthLayout from '../../../components/calendar/calendar';
import Announcement from '../../../components/announcements/announcement';

interface AnnouncementData {
  announcement_id: number;
  title_header: string;
  time_date: string;
  image_url: string;
  description_text: string;
}

const DashboardPage: FC = () => {
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
      <div className="bg-blue-900 p-4 text-white">
        <h1 className="text-xl">Good Day!</h1>
      </div>
      <div>
        <div className="flex justify-between p-2">
          <div className="flex flex-col space-y-4">
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
              <p>No announcements available.</p>
            )}
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
