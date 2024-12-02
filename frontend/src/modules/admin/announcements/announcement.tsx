import { FC, useState } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import AddAnnouncement from '../../../components/modal/add-announcement';

const AnnouncementPage: FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Define the onSubmit function that will handle the form data
  const handleSubmit = (title: string, body: string, fileUrl: string | null) => {
    // Handle the submitted data here
    console.log('Submitted Title:', title);
    console.log('Submitted Body:', body);
    console.log('Submitted File URL:', fileUrl);

    // Here you can perform your logic, such as sending the data to an API.
    // Example:
    // axios.post('/api/announcements', { title, body, fileUrl })
    //   .then((response) => {
    //     console.log('Announcement created:', response.data);
    //   })
    //   .catch((error) => {
    //     console.error('Error creating announcement:', error);
    //   });
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

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
            <div className="flex justify-between items-center flex-wrap">
              <h2 className="text-2xl font-bold">Announcement Title</h2>
              <button className="bg-red-600 text-white px-4 py-2 rounded mt-2 sm:mt-0">
                Archive
              </button>
            </div>
            <p className="mt-4 text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div className="mt-6">
              <img
                src="https://placehold.co/800x500"
                alt="People working on computers in an office setting"
                className="w-full h-[30rem]"
              />
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Announcement Created 09-18-2024
            </p>
            <div className="flex justify-center mt-4">
              <button className="bg-gray-400 text-white px-4 py-2 rounded mx-2">
                <FaChevronLeft />
              </button>
              <button className="bg-gray-400 text-white px-4 py-2 rounded mx-2">
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddAnnouncement
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onSubmit={handleSubmit}  // Pass the actual handleSubmit function here
      />
    </>
  );
};

export default AnnouncementPage;
