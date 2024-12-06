import { FC, useState, useEffect } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import AddAnnouncement from '../../../components/modal/add-announcement';
import axios from 'axios';

interface Announcement {
  announcement_id: number;
  title_header: string;
  time_date: string;
  image_url: string;
  description_text: string;
  status: string; // "active" or "archived"
}

const AnnouncementPage: FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Function to fetch announcements from the API
  const fetchAnnouncements = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/announcement/getAllAnnouncements`,
        {
          params: {
            page,
            limit: 1, // Adjust the limit if you want more items per page
          },
        }
      );
      const { data, pagination } = response.data;
      setAnnouncements(data);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to update the announcement status
  const updateAnnouncementStatus = async (announcementId: number, newStatus: string) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/announcement/updateStatus`,
        {
          announcement_id: announcementId,
          status: newStatus,
        }
      );
      if (response.status === 200) {
        // Update the status locally after successful API call
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.map((announcement) =>
            announcement.announcement_id === announcementId
              ? { ...announcement, status: newStatus }
              : announcement
          )
        );
      }
    } catch (error) {
      console.error('Error updating announcement status:', error);
    }
  };

  // Handle modal open/close
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Handle pagination
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Fetch announcements whenever the currentPage changes
  useEffect(() => {
    fetchAnnouncements(currentPage);
  }, [currentPage]);

  return (
    <>
      <div className="bg-blue-900 p-4 text-white">
        <h1 className="text-xl">Good Day!</h1>
      </div>
      <div className="bg-gray">
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-blue-700 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl">Announcement</h1>
            <button
              className="bg-yellow-400 text-black px-4 py-2 rounded"
              onClick={openModal}
            >
              New
            </button>
          </div>
          <div className="bg-gray-100 p-6 mt-4 shadow-lg">
            {loading ? (
              <p>Loading...</p>
            ) : announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement.announcement_id}>
                  <div className="flex justify-between items-center flex-wrap">
                    <h2 className="text-2xl font-bold">{announcement.title_header}</h2>
                    <button
                      className={`${
                        announcement.status === 'active' ? 'bg-red-600' : 'bg-green-600'
                      } text-white px-4 py-2 rounded mt-2 sm:mt-0`}
                      onClick={() =>
                        updateAnnouncementStatus(
                          announcement.announcement_id,
                          announcement.status === 'active' ? 'archived' : 'active'
                        )
                      }
                    >
                      {announcement.status === 'active' ? 'Archive' : 'Unarchive'}
                    </button>
                  </div>
                  <p className="mt-4 text-lg">{announcement.description_text}</p>
                  {announcement.image_url && (
                    <div className="mt-6">
                      <img
                        src={announcement.image_url}
                        alt={announcement.title_header}
                        className="w-full h-[30rem]"
                      />
                    </div>
                  )}
                  <p className="mt-4 text-sm text-gray-600">
                    Announcement Created {new Date(announcement.time_date).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No announcements available.</p>
            )}
            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded mx-2"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
              <span className="px-4 py-2">{currentPage}</span>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded mx-2"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddAnnouncement
        isOpen={modalIsOpen}
        onClose={closeModal}
        onSubmit={(title, body, imageUrl) => {
          setModalIsOpen(false);
          // Logic for adding the announcement
        }}
      />
    </>
  );
};

export default AnnouncementPage;
