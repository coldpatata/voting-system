import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageViewer from '../../../components/modal/imageviewer';
import Header from '../../../components/header/header';
import QRViewer from '../../../components/modal/qr-viewer';

interface Participant {
  participant_id: number;
  participant_name: string;
  position: string;
  photo_url: string;
}

const ViewBallotPage: React.FC = () => {
  const { ballotId } = useParams<{ ballotId: string }>();
  const navigate = useNavigate();
  const [ballotName, setBallotName] = useState('');
  const [positions, setPositions] = useState<Record<string, Participant[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [ballotQRCode, setBallotQRCode] = useState<string | null>(null);

  useEffect(() => {
    if (ballotId) {
      fetchBallotData(Number(ballotId));
    }

    // Cleanup on unmount
    return () => {
      setBallotName('');
      setPositions({});
    };
  }, [ballotId]);

  const fetchBallotData = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/ballot/getBallotWithParticipants?ballot_id=${id}`
      );

      if (response.status === 200) {
        const { ballot_name, participants } = response.data.data;
        setBallotName(ballot_name);

        // Group participants by position
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

  const handleViewQR = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ballot/getBallot/${ballotId}`);
      if (response.data.success) {
        setBallotQRCode(response.data.data.qr_code);
        setQrModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load QR code',
        icon: 'error'
      });
    }
  };

  return (
    <>
      <Header />
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-blue-800 text-white text-lg font-bold p-4 rounded-t-lg">
          View Ballot
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Ballot Name
                </label>
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
                    <div
                      key={index}
                      className="border border-gray-300 rounded p-4"
                    >
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
                              <ImageViewer
                                src={
                                  candidate.photo_url || '/default-avatar.png'
                                }
                                alt={`Image of ${candidate.participant_name}`}
                                className="w-12 h-12 rounded-full object-cover"
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
              onClick={() => navigate(-1)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Back
            </button>
            <button
              onClick={handleViewQR}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              View QR
            </button>
          </div>
        </div>
      </div>
      <QRViewer
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        qrCode={ballotQRCode || ''}
        ballotName={ballotName}
      />
    </>
  );
};

export default ViewBallotPage;
