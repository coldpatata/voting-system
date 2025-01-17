import { FC, useState, useEffect } from 'react';
import ArchiveModal from '../../../components/modal/archive';
import AddPositionModal from '../../../components/modal/add-position';
import EditPositionModal from '../../../components/modal/edit-position';
import axios from 'axios';

const StaffPositionPage: FC = () => {
  const [positions, setPositions] = useState<any[]>([]);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isAddPositionModalOpen, setIsAddPositionModalOpen] = useState(false);
  const [isEditPositionModalOpen, setIsEditPositionModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<any | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const fetchPositions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/positions/getAllPositions?includeArchived=${showArchived}`
      );
      setPositions(response.data.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [showArchived]);

  // Modal handlers
  const handleOpenArchiveModal = () => setIsArchiveModalOpen(true);
  const handleCloseArchiveModal = () => setIsArchiveModalOpen(false);
  const handleOpenAddPositionModal = () => setIsAddPositionModalOpen(true);
  const handleCloseAddPositionModal = () => setIsAddPositionModalOpen(false);
  const handleOpenEditPositionModal = (position: any) => {
    setSelectedPosition(position);
    setIsEditPositionModalOpen(true);
  };
  const handleCloseEditPositionModal = () => setIsEditPositionModalOpen(false);

  const handleConfirmArchive = async () => {
    if (selectedPosition) {
      await handleArchive(selectedPosition.position_id);
    }
    setIsArchiveModalOpen(false);
  };

  const handleArchive = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/api/positions/${id}/archive`);
      fetchPositions();
    } catch (error) {
      console.error('Error archiving position:', error);
    }
  };

  return (
    <>
      <div className="bg-blue-900 p-4 text-white">
        <h1 className="text-xl">Good Day!</h1>
      </div>
      <div className="min-h-screen bg-gray-200 p-8">
        {/* Header section - similar to admin */}
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

        {/* Table section - similar to admin */}
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
                  <td className="py-2 px-4 border">{position.max_vote_count}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleOpenEditPositionModal(position)}
                      className="bg-yellow-400 text-black px-4 py-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded"
                      onClick={() => {
                        setSelectedPosition(position);
                        handleOpenArchiveModal();
                      }}
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - similar to admin */}

        {/* Modals - same as admin */}
        <ArchiveModal
          isOpen={isArchiveModalOpen}
          onClose={handleCloseArchiveModal}
          onConfirm={handleConfirmArchive}
        />
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
      </div>
    </>
  );
};

export default StaffPositionPage;
