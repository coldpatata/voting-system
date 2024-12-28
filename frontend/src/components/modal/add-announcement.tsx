import React, { useState } from 'react';
import axios from 'axios';

interface AddAnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, body: string, fileUrl: string | null) => void;
}

const AddAnnouncement: React.FC<AddAnnouncementProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      // Initialize file-related variables
      let fileUrl = null;
      let fullUrl = null;

      // Check if a file is provided
      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);

          // Upload the file
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
          } else {
            console.warn('File upload failed with status:', response.status);
          }
        } catch (uploadError) {
          console.error('Error during file upload:', uploadError);
          alert('Image upload failed. Proceeding without an image.');
        }
      }

      // Prepare the announcement data
      const announcementData = {
        title_header: title,
        time_date: new Date(),
        image_url: fullUrl, // Will be null if no file was uploaded
        description_text: body,
      };

      // Create the announcement
      const createResponse = await axios.post(
        'http://localhost:5000/api/announcement/createAnnouncement',
        announcementData
      );

      if (createResponse.status === 201) {
        console.log('Announcement created successfully:', createResponse.data);
        alert('Announcement created successfully!');
        onSubmit(title, body, fileUrl); // Pass the `fileUrl` (null if no file uploaded)
        onClose(); // Close the modal
      } else {
        throw new Error('Failed to create announcement');
      }
    } catch (error) {
      console.error('Error submitting announcement:', error);
      alert(
        'An error occurred while submitting the announcement. Please try again.'
      );
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded shadow-md">
        <div className="w-full bg-blue-700 text-white text-center py-4 rounded-t">
          <h1 className="text-xl font-bold">Create Announcement</h1>
        </div>
        <div className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">
              Announcement Body
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="body"
              rows={10}
              placeholder="Announcement Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4 text-center">
            <p className="text-gray-700">Or add photo as announcement</p>
            <div className="flex items-center justify-center mt-2">
              <i className="fas fa-info-circle text-blue-500 mr-2"></i>
              <span className="text-blue-500">Accepted formats are png and jpeg.</span>
            </div>
            <div className="mt-4">
              <label className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded cursor-pointer">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAnnouncement;
