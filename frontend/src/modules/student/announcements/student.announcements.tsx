import { FC } from 'react';
import AnnouncementModal from '../../../components/announcements/announcement-modal';
import Header from '../../../components/header/header';

const StudentAnnouncements: FC = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="bg-blue-700 text-white p-4">
            <h1 className="text-xl font-bold">Announcements</h1>
          </div>
          <AnnouncementModal isAdmin={false} />
        </div>
      </div>
    </>
  );
};

export default StudentAnnouncements;
