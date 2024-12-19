import React, { useState } from 'react';
import QRCodeModal from './qr-code';
import { profile } from '../../assets/image/image';
import axios from 'axios';

interface AddBallotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBallotModal: React.FC<AddBallotModalProps> = ({ isOpen, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  // States to handle form data
  const [ballotName, setBallotName] = useState('');
  const [openingDate, setOpeningDate] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [eligibility, setEligibility] = useState('all');

  const handleSaveBallot = async () => {
    if (!ballotName || ballotName.trim() === '') {
      // Notify the user that the ballot name is required
      alert('Ballot name is required.');
      return; // Stop the function if the ballot name is not provided
    }

    const ballotData = {
      name: ballotName,
      openingDate: openingDate,
      closingDate: closingDate,
      eligibility: eligibility,
    };

    const ballotDataPayLoad = {
      ballot_name: ballotName,
      opening_date: openingDate,
      closing_date: closingDate,
      year_level_eligibility: eligibility,
    };

    try {
      // Call the createBallot endpoint
      const ballotResponse = await axios.post(
        'http://localhost:5000/api/ballot/createBallot',
        ballotDataPayLoad
      );
      console.log('Ballot created:', ballotResponse.data);

      // Get the ballot ID from the response
      const ballotId = ballotResponse.data.ballot_id;
      console.log(ballotId)
      console.log(ballotId)
      // Get candidate names from the input fields
      const presidentName = (document.getElementById('candidate-1') as HTMLInputElement)?.value;
      const vicePresidentName = (document.getElementById('candidate-2') as HTMLInputElement)?.value;
      console.log(presidentName)
      console.log(vicePresidentName)

      // Example candidate data; adjust as needed
      const candidates = [
        {
          candidate_name: presidentName || 'Default President Name', // Fallback in case the input is empty
          ballot_id: ballotId, // Associate the candidate with this ballot
        },
        {
          candidate_name: vicePresidentName || 'Default Vice President Name', // Fallback in case the input is empty
          ballot_id: ballotId, // Associate the candidate with this ballot
        },
      ];

      // Loop through each candidate and call the createCandidate endpoint
      for (const candidate of candidates) {
        const candidateResponse = await axios.post(
          'http://localhost:5000/api/candidate/createCandidate',
          candidate
        );
        console.log('Candidate created:', candidateResponse.data);
      }

      // Generate the QR code
      const qrResponse = await axios.post(
        'http://localhost:5000/api/qr/generate-qr',
        ballotData
      );
      console.log('QR code generated:', qrResponse.data);

      setQrCodeUrl(qrResponse.data.qrCode);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error occurred:', error);
      alert('An error occurred while processing the request. Please try again.');
    }
  };



  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!isOpen) return null;

  const formattedDateTimeOD = openingDate.slice(0, 16);
  const formattedDateTimeCD = closingDate.slice(0, 16);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[800px] p-6">
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
              value={ballotName}
              onChange={(e) => setBallotName(e.target.value)}
            />
          </div>

          {/* Opening Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Opening Date
            </label>
            <input
              type="datetime-local"
              className="border rounded-lg p-2 mt-1 focus:outline-blue-700"
              value={formattedDateTimeOD}
              onChange={(e) => setOpeningDate(e.target.value)}
            />
          </div>

          {/* Closing Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Closing Date
            </label>
            <input
              type="datetime-local"
              className="border rounded-lg p-2 mt-1 focus:outline-blue-700"
              value={formattedDateTimeCD}
              onChange={(e) => setClosingDate(e.target.value)}
            />
          </div>

          {/* Year Level Eligibility */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Year Level Eligibility
            </label>
            <select
              className="border rounded-lg p-2 mt-1 focus:outline-blue-700"
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
            >
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
            {/* President Section */}
            <div>
              <h4 className="font-semibold">President</h4>
              <ul>
                <li className="flex items-center gap-2 mb-2">
                  <img
                    src={profile}
                    alt="Candidate"
                    className="w-8 h-8 rounded-full"
                  />
                  <input
                    id="candidate-1" // Generic ID for the first candidate
                    type="text"
                    defaultValue="Emma Carter"
                    className="border rounded-lg p-2 w-full"
                  />
                </li>
                {/* Add Candidate Button */}
                <div className="space-x-2">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg">
                    Remove
                  </button>
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded-lg">
                    Add Candidate
                  </button>
                </div>
              </ul>
            </div>

            {/* Vice President Section */}
            <div>
              <h4 className="font-semibold">Vice President</h4>
              <ul>
                <li className="flex items-center gap-2 mb-2">
                  <img
                    src={profile}
                    alt="Candidate"
                    className="w-8 h-8 rounded-full"
                  />
                  <input
                    id="candidate-2" // Generic ID for the second candidate
                    type="text"
                    defaultValue="Emma Carter"
                    className="border rounded-lg p-2 w-full"
                  />
                </li>
                {/* Add Candidate Button */}
                <div className="space-x-2">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg">
                    Remove
                  </button>
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded-lg">
                    Add Candidate
                  </button>
                </div>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveBallot}
            type="button"
            className="bg-[#22C55E] hover:bg-[#1c9665] text-white px-2 py-1 rounded-lg"
          >
            Create Ballot
          </button>
        </div>

        <QRCodeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          qrCodeImage={qrCodeUrl || ''}
          qrData={{
            name: ballotName,
            openingDate: openingDate,
            closingDate: closingDate,
            eligibility: eligibility,
          }}
        />
      </div>
    </div>
  );
};

export default AddBallotModal;
