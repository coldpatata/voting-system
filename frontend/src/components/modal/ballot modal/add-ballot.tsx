import { useState, useEffect } from 'react';
import QRCodeModal from '../qr-code';
import { profile } from '../../../assets/image/image';
import axios from 'axios';
import Dropdown from '../../dropdown/dropdown';
import Swal from 'sweetalert2';
import { Candidate } from '../../dropdown/dropdown'; // Adjust the path as needed
import ImageViewer from '../imageviewer';

interface AddBallotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBallotModal: React.FC<AddBallotModalProps> = ({ isOpen, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [ballotCandidates, setBallotCandidates] = useState<Candidate[]>([]);
  const [ballotName, setBallotName] = useState('');
  const [openingDate, setOpeningDate] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [eligibility, setEligibility] = useState('all');
  const [positions, setPositions] = useState<string[]>([
    'President',
    'Vice President',
  ]);
  const handleRemovePosition = (position: string) => {
    setPositions((prevPositions) =>
      prevPositions.filter((p) => p !== position)
    );
  };
  useEffect(() => {
    console.log('Updated ballotCandidatesxxxcaaa:', ballotCandidates);
  }, [ballotCandidates]); // Dependency array ensures this runs when ballotCandidatesState is updated

  const handleBallotCandidatesUpdate = (updatedCandidates: Candidate[]) => {
    setBallotCandidates(updatedCandidates);
  };

  const createParticipant = async (
    ballotId: number,
    participantName: string,
    position: string,
    photo_url: string
  ) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/participant/createParticipants',
        {
          ballot_id: ballotId,
          participant_name: participantName,
          position: position,
          photo_url: photo_url,
        }
      );

      console.log('Participant created successfully:', response.data);
      return response.data; // You can use this data in your app
    } catch (error) {
      console.error('Error creating participant:', error);
      throw error; // Optionally rethrow the error to handle it elsewhere
    }
  };

  const handleAddPosition = () => {
    const newPosition = `Position ${positions.length + 1}`;
    setPositions((prevPositions) => [...prevPositions, newPosition]);
  };

  const handleSaveBallot = async () => {
    if (!ballotName || !openingDate || !closingDate) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      // Send data to the backend to create a ballot
      const response = await axios.post(
        'http://localhost:5000/api/ballot/createBallot',
        {
          ballot_name: ballotName,
          opening_date: openingDate,
          closing_date: closingDate,
          year_level_eligibility: eligibility,
        }
      );

      // Handle the response
      if (response.status === 201) {
        // Access the ballot_id from the response's data
        const ballotID = response.data.ballot_id;

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Ballot created!',
        }).then(async () => {
          // Now, after creating the ballot, create participants using the candidates' data
          if (ballotCandidates.length > 0) {
            for (const candidate of ballotCandidates) {
              // Call the function to create participants
              try {
                const participantResponse = await createParticipant(
                  ballotID,
                  `${candidate.firstname} ${candidate.lastname}`,
                  candidate.position,
                  candidate.photo_url
                );
                console.log('Created participant:', participantResponse);
              } catch (error) {
                console.error(
                  'Error creating participant for candidate:',
                  candidate,
                  error
                );
              }
            }
          }

          // Reset form and states
          setBallotName('');
          setOpeningDate('');
          setClosingDate('');
          setEligibility('all');
          window.location.reload();
          onClose(); // Close the modal
        });
      } else {
        alert('Failed to create ballot. Please try again.');
      }
    } catch (error) {
      console.error('Error creating ballot:', error);
      alert('An error occurred while creating the ballot.');
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
      <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[800px] p-6 max-h-[90vh] overflow-y-auto">
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

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Year Level Eligibility
            </label>
            <select
              className="border rounded-lg p-2 mt-1 focus:outline-blue-700"
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
            >
              <option value="all">All year levels</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
            </select>
          </div>
        </form>

        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Positions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positions.map((position) => (
              <div key={position} className="flex flex-col justify-end w-full">
                <div>
                  <Dropdown
                    onBallotCandidatesUpdate={handleBallotCandidatesUpdate}
                    ImageViewer={ImageViewer}
                  />
                </div>
                <div className="w-full flex justify-end">
                  <button
                    onClick={() => handleRemovePosition(position)}
                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddPosition}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
          >
            Add Position
          </button>
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
