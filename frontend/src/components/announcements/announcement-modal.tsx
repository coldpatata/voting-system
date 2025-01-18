import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';

interface AnnouncementData {
  announcement_id: number;
  title_header: string;
  time_date: string;
  image_url: string;
  description_text: string;
  status?: string;
}

interface AnnouncementProps {
  isAdmin?: boolean;
  onStatusChange?: (id: number, status: string) => void;
}

const AnnouncementModal: React.FC<AnnouncementProps> = ({ isAdmin = false, onStatusChange }) => {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAnnouncements = async (page: number) => {
    setLoading(true);
    try {
      const endpoint = isAdmin 
        ? '/api/announcement/getAllAnnouncements'
        : '/api/announcement/getAnnouncements';

      const response = await axios.get(`http://localhost:5000${endpoint}`, {
        params: {
          page: Math.max(1, page), // Ensure page is at least 1
          limit: 1
        }
      });

      // Remove success check since it's not in the response
      if (response.data) {
        setAnnouncements(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setCurrentPage(response.data.pagination.currentPage);
        setError(null);
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      setError('Error fetching announcements');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use useCallback to memoize the function
  const handlePageChange = React.useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  useEffect(() => {
    fetchAnnouncements(currentPage);
  }, [currentPage, isAdmin]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (loading) return <div className="text-center p-4">Loading announcements...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="flex flex-col items-center p-4">
      {announcements.map((announcement) => (
        <div
          key={announcement.announcement_id}
          className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden mb-6"
        >
          <div className="bg-blue-900 text-white py-4 px-6 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Announcement</h1>
            {isAdmin && announcement.status && (
              <span className={`px-2 py-1 rounded text-sm ${
                announcement.status === 'active' 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`}>
                {announcement.status}
              </span>
            )}
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{announcement.title_header}</h2>
            <p className="text-gray-700 mb-4 max-h-54 overflow-hidden overflow-y-auto text-justify whitespace-pre-wrap">
              {announcement.description_text}
            </p>
            {announcement.image_url && (
              <div className="flex justify-center mb-4">
                <img
                  src={announcement.image_url}
                  alt="Announcement"
                  className="w-full h-[30rem] object-contain"
                />
              </div>
            )}
            <p className="text-gray-600 text-sm">
              <strong>Posted:</strong>{' '}
              {new Date(announcement.time_date).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
      
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default React.memo(AnnouncementModal); // Optimize re-renders
