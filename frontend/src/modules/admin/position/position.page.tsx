import { FC, useState, useEffect } from 'react';
import ArchiveModal from '../../../components/modal/archive';
import Header from '../../../components/header/header';
import AddPositionModal from '../../../components/modal/add-position';
import EditPositionModal from '../../../components/modal/edit-position';
import axios from 'axios';

const PositionPage: FC = () => {
  const [positions, setPositions] = useState<any[]>([]); // State to store the positions
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isAddPositionModalOpen, setIsAddPositionModalOpen] = useState(false);
  const [isEditPositionModalOpen, setIsEditPositionModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<any | null>(null);

  // Fetch positions from the API on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/position/getAllPositions')
      .then((response) => {
        setPositions(response.data.data); // Set the fetched positions
      })
      .catch((error) => {
        console.error('Error fetching positions:', error);
      });
  }, []);

  const handleOpenArchiveModal = () => setIsArchiveModalOpen(true);
  const handleCloseArchiveModal = () => setIsArchiveModalOpen(false);

  const handleOpenAddPositionModal = () => setIsAddPositionModalOpen(true);
  const handleCloseAddPositionModal = () => setIsAddPositionModalOpen(false);

  const handleOpenEditPositionModal = (position: any) => {
    setSelectedPosition(position);
    setIsEditPositionModalOpen(true);
  };
  const handleCloseEditPositionModal = () => setIsEditPositionModalOpen(false);

  const handleConfirmArchive = () => {
    alert('Item archived!');
    setIsArchiveModalOpen(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-200 p-8">
        <div className="bg-blue-900 text-white p-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl font-bold mb-2 md:mb-0">Position</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenAddPositionModal}
              className="bg-yellow-400 text-black px-4 py-2 rounded"
            >
              Add
            </button>
            <div className="flex">
              <input
                type="text"
                className="px-2 py-1 rounded-tl-lg rounded-bl-lg text-black"
              />
              <button className="bg-yellow-400 w-1/4 p-2">Search</button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-gray-300">
                <th className="py-2 px-4 border">Designation</th>
                <th className="py-2 px-4 border">Max Vote Count</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => (
                <tr key={position.position_id} className="text-center">
                  <td className="py-2 px-4 border">{position.position_name}</td>
                  <td className="py-2 px-4 border">
                    {position.max_vote_count}
                  </td>

                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleOpenEditPositionModal(position)}
                      className="bg-yellow-400 text-black px-4 py-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded"
                      onClick={handleOpenArchiveModal}
                    >
                      Archive
                    </button>
                    <ArchiveModal
                      isOpen={isArchiveModalOpen}
                      onClose={handleCloseArchiveModal}
                      onConfirm={handleConfirmArchive}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center space-x-2 py-4">
          <button className="text-gray-600">&laquo; Previous</button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded ${page === 2 ? 'bg-blue-900 text-white' : 'text-gray-600'
                }`}
            >
              {page}
            </button>
          ))}
          <button className="text-gray-600">Next &raquo;</button>
        </div>
      </div>
      <AddPositionModal
        isOpen={isAddPositionModalOpen}
        onClose={handleCloseAddPositionModal}
      />
      {selectedPosition && (
        <EditPositionModal
          isOpen={isEditPositionModalOpen}
          title="Edit Position"
          onClose={handleCloseEditPositionModal}
          position={selectedPosition}
        />
      )}
    </>
  );
};

export default PositionPage;
