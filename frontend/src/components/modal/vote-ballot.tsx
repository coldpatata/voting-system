import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  ballotId: number;
}

interface Participant {
  participant_id: number;
  participant_name: string;
  position: string;
  photo_url: string;
}

const VoteBallot: React.FC<ModalProps> = ({ isOpen, onClose, ballotId }) => {
  const [ballotName, setBallotName] = useState('');
  const [positions, setPositions] = useState<Record<string, Participant[]>>({});
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && ballotId) {
      fetchBallotData(ballotId);
    }
    return () => {
      setBallotName('');
      setPositions({});
      setSelectedCandidates({});
    };
  }, [isOpen, ballotId]);

  const fetchBallotData = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/ballot/getBallotWithParticipants?ballot_id=${id}`
      );

      if (response.status === 200) {
        const { ballot_name, participants } = response.data.data;
        setBallotName(ballot_name);

        const groupedPositions = participants.reduce(
          (acc: Record<string, Participant[]>, participant: Participant) => {
            if (!acc[participant.position]) {
              acc[participant.position] = [];
            }
            acc[participant.position].push(participant);
            return acc;
          },
          {}
        );

        setPositions(groupedPositions);
      }
    } catch (error) {
      console.error('Error fetching ballot data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCandidateSelection = (position: string, candidateId: number) => {
    setSelectedCandidates((prev) => ({
      ...prev,
      [position]: candidateId,
    }));
  };

  const handleSubmit = async () => {
    const userId = Cookies.get('uid'); // Get user_id from cookies
    const currentBallotId = ballotId

    if (!userId || !currentBallotId) {
      alert('User ID or Ballot ID is missing!');
      return;
    }

    const votes = Object.entries(selectedCandidates).map(([position, candidateId]) => ({
      ballot_id: Number(currentBallotId),
      candidate_id: candidateId,
      user_id: Number(userId),
    }));

    try {
      for (const vote of votes) {
        await axios.post('http://localhost:5000/api/vote/insertVote', vote);
      }

      alert('Vote submitted successfully!');
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error submitting votes:', error);
      alert('An error occurred while submitting your votes.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-blue-800 text-white text-lg font-bold p-4 rounded-t-lg">
          Vote Ballot
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Ballot Name</label>
                <input
                  type="text"
                  value={ballotName}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-200"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(positions).map(
                  ([position, candidates], index) => (
                    <div key={index} className="border border-gray-300 rounded p-4">
                      <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">
                          Position
                        </label>
                        <input
                          type="text"
                          value={position}
                          className="w-full p-2 border border-gray-300 rounded bg-gray-200"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">
                          Candidates
                        </label>
                        <div className="space-y-2">
                          {candidates.map((candidate) => (
                            <div
                              key={candidate.participant_id}
                              className="flex items-center space-x-2"
                            >
                              <img
                                src={candidate.photo_url}
                                alt={`Image of ${candidate.participant_name}`}
                                className="w-12 h-12 rounded-full"
                              />
                              <input
                                type="text"
                                value={candidate.participant_name}
                                className="flex-1 p-2 border border-gray-300 rounded bg-gray-200"
                                readOnly
                              />
                              <input
                                type="radio"
                                name={`position-${index}`}
                                className="form-radio h-5 w-5 text-gray-600"
                                onChange={() =>
                                  handleCandidateSelection(position, candidate.participant_id)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={onClose}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteBallot;
