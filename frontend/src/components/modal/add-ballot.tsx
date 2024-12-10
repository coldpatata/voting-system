import React, { useState } from 'react';
import QRCodeModal from './qr-code';

interface AddBallotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBallotModal: React.FC<AddBallotModalProps> = ({ isOpen, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveBallot = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[800px] p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-700">Add Ballot</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            ✖
          </button>
        </div>

        {/* Form Content */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ballot Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Ballot Name
            </label>
            <input
              type="text"
              placeholder="Enter ballot name"
              className="border rounded-lg p-2 mt-1 focus:outline-blue-700"
            />
          </div>

          {/* Opening Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Opening Date
            </label>
            <input
              type="date"
              className="border rounded-lg p-2 mt-1 focus:outline-blue-700"
            />
          </div>

          {/* Closing Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Closing Date
            </label>
            <input
              type="date"
              className="border rounded-lg p-2 mt-1 focus:outline-blue-700"
            />
          </div>

          {/* Year Level Eligibility */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Year Level Eligibility
            </label>
            <select className="border rounded-lg p-2 mt-1 focus:outline-blue-700">
              <option value="all">All year level</option>
              <option value="first">First year</option>
              <option value="second">Second year</option>
              <option value="third">Third year</option>
              <option value="fourth">Fourth year</option>
            </select>
          </div>
        </form>

        {/* Positions and Candidates */}
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Positions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">President</h4>
              <ul>
                <li className="flex items-center gap-2 mb-2">
                  <img
                    src="/path-to-avatar.png"
                    alt="Candidate"
                    className="w-8 h-8 rounded-full"
                  />
                  <input
                    type="text"
                    defaultValue="Emma Carter"
                    className="border rounded-lg p-2 w-full"
                  />
                </li>
                {/* Add Candidate Button */}
                <button className="bg-yellow-400 text-white px-4 py-2 rounded-lg">
                  Add Candidate
                </button>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveBallot}
            type="button"
            className="bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Save Ballot
          </button>

          <QRCodeModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            qrCodeImage="path/to/your-qr-code.png"
          />
        </div>
      </div>
    </div>
  );
};

export default AddBallotModal;
