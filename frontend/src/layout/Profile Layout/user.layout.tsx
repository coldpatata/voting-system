import { FC, useState, useEffect } from 'react';

const UserLayout: FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    email: '',
    contactNumber: '',
  });

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="p-4">
      <div className="bg-blue-100 text-blue-700  mb-4 flex items-center">
        <i className="fas fa-info-circle mr-2"></i>
        <span>Update your account's profile information.</span>
      </div>
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <div className="w-full flex flex-col justify-center items-center lg:w-1/2 lg:items-start lg:order-2">
          <div className="flex flex-col justify-center items-center w-full">
            <div className="w-32 h-32 mb-4">
              <img
                src="https://placehold.co/128x128"
                alt="Profile icon"
                className="w-full h-full object-cover rounded-full border-2 border-black"
              />
            </div>
            <div className="flex items-center mb-4">
              <button
                className={`bg-yellow-400 text-black px-4 py-2 rounded mr-2 ${
                  isEditing ? '' : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={!isEditing}
              >
                Choose File
              </button>
              <span>No File Chosen</span>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:order-1">
          <div className="mb-4">
            <label className="block mb-1">Firstname</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={userData.firstName}
              disabled={!isEditing}
              onChange={(e) =>
                setUserData({ ...userData, firstName: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Lastname</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={userData.lastName}
              disabled={!isEditing}
              onChange={(e) =>
                setUserData({ ...userData, lastName: e.target.value })
              }
            />
          </div>
          <div className="mb-4 flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 lg:mr-2 mb-4 lg:mb-0">
              <label className="block mb-1">Middle Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={userData.middleName}
                disabled={!isEditing}
                onChange={(e) =>
                  setUserData({ ...userData, middleName: e.target.value })
                }
              />
            </div>
            <div className="w-full lg:w-1/2">
              <label className="block mb-1">Suffix</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={userData.suffix}
                disabled={!isEditing}
                onChange={(e) =>
                  setUserData({ ...userData, suffix: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={userData.email}
              disabled={!isEditing}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Contact Number</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={userData.contactNumber}
              disabled={!isEditing}
              onChange={(e) =>
                setUserData({ ...userData, contactNumber: e.target.value })
              }
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="bg-yellow-400 text-black px-4 py-2 rounded"
          onClick={toggleEditing}
        >
          {isEditing ? 'Save Changes' : 'Edit'}
        </button>
      </div>
    </div>
  );
};

export default UserLayout;
