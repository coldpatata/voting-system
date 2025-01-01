import { FC, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import axios from 'axios';
import swal from 'sweetalert2';

const UserLayout: FC = () => {
  const profile_url = Cookies.get('profile_url');
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>(''); // State to store the file name
  const [userData, setUserData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    contactNumber: '',
    profile_url: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const toggleEditing = async () => {
    if (isEditing) {
      try {
        const uid = Cookies.get('uid');
        let fileUrl = null;
        let fullUrl = null;

        if (!uid) {
          throw new Error('User ID not found in cookies');
        }

        if (file) {
          try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(
              'http://localhost:5000/api/upload/uploadSingle',
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            );

            if (response.status === 200) {
              fileUrl = response.data.fileUrl;
              fullUrl = `https://qdqcdyopziokllxehnuq.supabase.co/storage/v1/object/public/uploads/${fileUrl}`;
              console.log('Image uploaded successfully:', fileUrl);
              Cookies.set('profile_url', fullUrl, { expires: 7, secure: true });
            } else {
              throw new Error('File upload failed');
            }
          } catch (uploadError) {
            console.error('Error during file upload:', uploadError);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Image upload failed. Proceeding without an image.',
            });
          }
        }

        const payload = {
          username: userData.userName,
          first_name: userData.firstName,
          last_name: userData.lastName,
          middle_initial: userData.middleName,
          email: userData.email,
          contact_number: userData.contactNumber,
          profile_url: userData.profile_url,
        };

        if (fullUrl) {
          payload.profile_url = fullUrl;
        }

        await axios.put(
          `http://localhost:5000/api/users/updateUserDetails?user_id=${uid}`,
          payload
        );

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User details updated successfully!',
          timer: 1500,
          allowOutsideClick: true,
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error('Error Updating:', error);

        Swal.fire({
          icon: 'error',
          title: 'User details update failed',
          text: 'Failed to update user details. Please try again.',
          confirmButtonText: 'Retry',
          timer: 1500,
          allowOutsideClick: true,
        });
      }
    }
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = Cookies.get('uid');
        if (!uid) {
          throw new Error('User ID not found in cookies');
        }

        const response = await axios.get(
          `http://localhost:5000/api/users/${uid}`
        );

        const data = response.data;
        setUserData({
          userName: data.username || '',
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          middleName: data.middle_initial || '',
          email: data.email || '',
          contactNumber: data.contact_number || '',
          profile_url: data.profile_url || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="p-4">
      <div className="bg-blue-100 text-blue-700 mb-4 flex items-center">
        <i className="fas fa-info-circle mr-2"></i>
        <span>Update your account's profile information.</span>
      </div>
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <div className="w-full flex flex-col justify-center items-center lg:w-1/2 lg:items-start lg:order-2">
          <div className="flex flex-col justify-center items-center w-full">
            <div className="w-32 h-32 mb-4">
              <img
                src={profile_url}
                alt="Profile icon"
                className="w-full h-full object-cover rounded-full border-2 border-black"
              />
            </div>
            <div className="flex items-center mb-4">
              {/* Hidden file input */}
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={!isEditing} // Disable input when not editing
              />

              {/* Styled button */}
              <label
                htmlFor="fileInput"
                className={`bg-yellow-400 text-black px-4 py-2 rounded mr-2 ${
                  isEditing ? '' : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ cursor: isEditing ? 'pointer' : 'not-allowed' }}
              >
                Choose File
              </label>
              <span>{fileName ? fileName : 'No file chosen'}</span>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:order-1">
          <div className="mb-4">
            <label className="block mb-1">Username</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={userData.userName}
              disabled={true}
              onChange={(e) =>
                setUserData({ ...userData, firstName: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <div className="flex gap-5">
              <div className="w-2/5">
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
              <div className="w-full">
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
            </div>
          </div>

          <div className="mb-4">
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
