import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import CustomMonthLayout from '../../../components/calendar/calendar';

const DashboardPageStudent: FC = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]); // State to store announcements
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State to store errors

  useEffect(() => {
    // Fetch announcements data on component mount
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/announcement/getAnnouncements');
        if (response.status === 200) {
          setAnnouncements(response.data.data); // Store announcements in state
        } else {
          setError('Failed to fetch announcements');
        }
      } catch (error) {
        setError('Error fetching announcements');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-900 p-4 text-white">
        <h1 className="text-xl">Dashboard</h1>
      </div>

      <div className="flex p-6">
        
        <div className="flex-1 space-y-6">

          {/* Announcements Section */}
          <div className="bg-white shadow-lg rounded-md p-4">
            <h2 className="bg-blue-900 text-white text-center py-2 rounded-t-md">
              Announcement
            </h2>
            <div className="p-4">
              {loading ? (
                <p>Loading announcements...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <div key={announcement.announcement_id} className="mb-6">
                    <h3 className="text-lg font-bold">{announcement.title_header}</h3>
                    <p>{announcement.description_text}</p>
                    <img
                      src={announcement.image_url}
                      alt={announcement.title_header}
                      className="my-4 w-full h-[200px] object-cover"
                    />
                    <p className="text-sm text-gray-500">
                      Announcement Created on {new Date(announcement.time_date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p>No announcements available</p>
              )}
            </div>

            <div className="flex justify-evenly mt-4">
              <button
                className="bg-blue-900 text-white px-4 py-2 rounded-md flex items-center"
                onClick={() => console.log('Previous Announcement')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                className="bg-blue-900 text-white px-4 py-2 rounded-md flex items-center"
                onClick={() => console.log('Next Announcement')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>


          </div>


          {/* Vote Tally Section */}
          <div className="bg-white shadow-lg rounded-md p-4">
            <h2 className="bg-blue-900 text-white text-center py-2 rounded-t-md">
              Vote Tally
            </h2>
            <table className="min-w-full text-center border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border p-2">President</th>
                  <th className="border p-2">V-President</th>
                  <th className="border p-2">Secretary</th>
                  <th className="border p-2">Treasurer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Person 1</td>
                  <td className="border p-2">Person 1</td>
                  <td className="border p-2">Person 1</td>
                  <td className="border p-2">Person 1</td>
                </tr>
                <tr>
                  <td className="border p-2">Person 2</td>
                  <td className="border p-2">Person 2</td>
                  <td className="border p-2">Person 2</td>
                  <td className="border p-2">Person 2</td>
                </tr>
                <tr>
                  <td className="border p-2">Person 3</td>
                  <td className="border p-2">Person 3</td>
                  <td className="border p-2">Person 3</td>
                  <td className="border p-2">Person 3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column for Calendar */}
        <div className="w-1/4 ml-6">
          <CustomMonthLayout />
        </div>
      </div>
    </div>
  );
};

export default DashboardPageStudent;
