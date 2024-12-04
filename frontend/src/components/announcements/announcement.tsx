import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type AnnouncementData = {
  announcement_id: number;
  title_header: string;
  time_date: string;
  image_url: string;
  description_text: string;
};

const Announcement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAnnouncements = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/announcement/getAnnouncements?page=${page}&limit=1`
      );
      const result = await response.json();
      if (response.ok) {
        setAnnouncements(result.data);
        setTotalPages(result.pagination.totalPages);
        setCurrentPage(result.pagination.currentPage);
      } else {
        setError(result.message || 'Failed to fetch announcements');
      }
    } catch (err) {
      setError('Error fetching announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(currentPage);
  }, [currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading) return <p>Loading announcements...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-center p-4">
      {announcements.map((announcement) => (
        <div key={announcement.announcement_id} className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
          <div className="bg-blue-900 text-white text-center py-2 rounded-t-lg">
            <h1 className="text-lg font-bold text-left ml-4">Announcement</h1>
          </div>
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{announcement.title_header}</h2>
            <p className="text-gray-700 mb-4 max-h-24 overflow-hidden overflow-y-auto">
              {announcement.description_text}
            </p>
            <div className="flex justify-center mb-4">
              <img
                src={announcement.image_url}
                alt="Announcement related"
                className="w-64 h-48 object-cover rounded-lg shadow-md"
              />
            </div>
            <p className="text-gray-600 text-sm">
              Announcement Created {new Date(announcement.time_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
      <div className="flex justify-center space-x-2 mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ${
            currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ${
            currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Announcement;
