import React from 'react'; // Import React and useState
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import icons if you're using react-icons

type AnnouncementProps = {
  title: string;
  description: string;
  imageUrl: string;
  date: string;
};

const Announcement: React.FC<AnnouncementProps> = ({
  title,
  description,
  imageUrl,
  date,
}) => {
  return (
    <div className="flex flex-col items-center  min-h-screen p-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <div className="bg-blue-900 text-white text-center py-2 rounded-t-lg">
          <h1 className="text-lg font-bold text-left ml-4">Announcement</h1>
        </div>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-gray-700 mb-4 max-h-24 overflow-hidden overflow-y-auto">
            {description}
          </p>
          <div className="flex justify-center mb-4">
            <img
              src={imageUrl}
              alt="Announcement related"
              className="w-64 h-48 object-cover rounded-lg shadow-md"
            />
          </div>
          <p className="text-gray-600 text-sm">Announcement Created {date}</p>
        </div>
        <div className="flex justify-center space-x-2 mt-4">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            <FaChevronLeft />
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
