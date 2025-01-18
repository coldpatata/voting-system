import { FC, useState } from 'react';
import axios from 'axios';
import Header from '../../../components/header/header';
import AnnouncementModal from '../../../components/announcements/announcement-modal';
import AddAnnouncement from '../../../components/modal/add-announcement';

const AnnouncementPage: FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/announcement/updateStatus`, {
        announcement_id: id,
        status
      });
      // Refresh the announcements after status change
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="bg-blue-700 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Announcements</h1>
            <button
              className="bg-yellow-400 text-black px-4 py-2 rounded"
              onClick={() => setModalIsOpen(true)}
            >
              New Announcement
            </button>
          </div>
          <AnnouncementModal 
            isAdmin={true} 
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      <AddAnnouncement
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onSubmit={() => {
          setModalIsOpen(false);
          window.location.reload();
        }}
      />
    </>
  );
};

export default AnnouncementPage;
