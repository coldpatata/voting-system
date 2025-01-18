import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageViewer from '../../../components/modal/imageviewer';
import Header from '../../../components/header/header';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie'; // Import Cookies to get user_id
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
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [ballotStatus, setBallotStatus] = useState<string>('');
  const [closingDate, setClosingDate] = useState<Date | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [ballotQRCode, setBallotQRCode] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      try {
        const uid = localStorage.getItem('uid') || 
                   sessionStorage.getItem('uid') || 
                   Cookies.get('uid');

        if (!uid) {
          Swal.fire({
            title: 'Authentication Error',
            text: 'Please log in to view this ballot',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate('/');
          });
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/ballot/getBallotWithParticipants`,
          {
            params: { ballot_id: ballotId, user_id: uid }
          }
        );

        // Handle eligibility error specifically
        if (!response.data.success) {
          Swal.fire({
            title: 'Access Denied',
            text: response.data.message,
            icon: 'warning',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate('/student/ballot');
          });
          return;
        }

        if (!isMounted) return;

        if (response.data.data.status === 'submitted') {
          Swal.fire({
            title: 'Already Submitted',
            text: 'You have already voted in this ballot',
            icon: 'info'
          }).then(() => {
            navigate('/student/ballot');
          });
          return;
        }

        if (new Date() < new Date(response.data.data.opening_date)) {
          Swal.fire({
            title: 'Not Yet Open',
            text: `This ballot will open on ${new Date(response.data.data.opening_date).toLocaleString()}`,
            icon: 'warning'
          }).then(() => {
            navigate('/student/ballot');
          });
          return;
        }

        // Continue with ballot data loading
        if (response.data.success) {
          const { 
            ballot_name, 
            participants, 
            closing_date, 
            status,
            hasVoted 
          } = response.data.data;

          setBallotName(ballot_name);
          setBallotStatus(status);
          setClosingDate(new Date(closing_date));
          setHasVoted(hasVoted);
          setIsSubmitDisabled(hasVoted || status === 'CLOSED');

          if (participants?.length > 0) {
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
        }

      } catch (error: any) {
        if (!isMounted) return;
        const errorMessage = error.response?.data?.message || error.message;
        
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/student/ballot');
        });
      }
    };

    if (ballotId) {
      checkAccess();
    }

    return () => {
      isMounted = false;
    };
  }, [ballotId, navigate]);

  const fetchBallotData = async (id: number) => {
    try {
      setIsLoading(true);
      const uid = localStorage.getItem('uid') || 
                  sessionStorage.getItem('uid') || 
                  Cookies.get('uid');

      if (!uid) {
        throw new Error('No user ID found');
      }

      const response = await axios.get(
        `http://localhost:5000/api/ballot/getBallotWithParticipants`,
        {
          params: { ballot_id: id, user_id: uid }
        }
      );

      if (response.data.success) {
        const { 
          ballot_name, 
          participants, 
          closing_date, 
          status,
          hasVoted 
        } = response.data.data;

        setBallotName(ballot_name);
        setBallotStatus(status);
        setClosingDate(new Date(closing_date));
        setHasVoted(hasVoted);
        setIsSubmitDisabled(hasVoted || status === 'CLOSED');

        if (participants?.length > 0) {
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
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/student/ballot');
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCandidateSelection = (position: string, participantId: number) => {
    setSelectedCandidates((prev) => ({
      ...prev,
      [position]: participantId,
    }));
  };

  const handleSubmit = async () => {
    // Check for user ID in multiple storage locations
    const uid = localStorage.getItem('uid') || 
                sessionStorage.getItem('uid') || 
                Cookies.get('uid');
    
    console.log('Attempting to get user ID from:', {
      localStorage: localStorage.getItem('uid'),
      sessionStorage: sessionStorage.getItem('uid'),
      cookies: Cookies.get('uid')
    });

    if (!uid) {
      console.log('No user ID found in storage');
      Swal.fire({
        title: 'Authentication Error',
        text: 'Please log in again to vote',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/');
      });
      return;
    }

    // Add validation for selected candidates
    const selectedPositions = Object.keys(selectedCandidates).length;
    const totalPositions = Object.keys(positions).length;

    if (selectedPositions < totalPositions) {
      Swal.fire({
        title: 'Incomplete Selection',
        text: `Please select candidates for all positions (${selectedPositions}/${totalPositions} selected)`,
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      const payload = {
        user_id: Number(uid),
        ballot_id: Number(ballotId),
        votes: Object.entries(selectedCandidates).map(([_, candidate_id]) => ({
          candidate_id: Number(candidate_id)
        }))
      };

      console.log('Submitting vote payload:', payload);

      const response = await axios.post(
        'http://localhost:5000/api/vote/createVote',
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        setIsSubmitDisabled(true);
        setHasVoted(true);
        
        Swal.fire({
          title: 'Success!',
          text: 'Your vote has been recorded successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Make sure to use the correct path
          navigate('/student/ballot/confirmation', {
            state: { 
              ballotName,
              submitDate: new Date().toLocaleString()
            }
          });
        });
      }
    } catch (error: any) {
      console.error('Vote submission error:', error.response?.data || error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to submit vote',
        icon: 'error',
        confirmButtonText: 'OK'
      });
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
                                onChange={() => handleCandidateSelection(position, candidate.participant_id)}
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
          {hasVoted && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
              You have already submitted your vote for this ballot.
            </div>
          )}
          {ballotStatus === 'CLOSED' && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              This ballot is closed and no longer accepting votes.
            </div>
          )}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={handleViewQR}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              View QR
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
              disabled={isSubmitDisabled || hasVoted || ballotStatus === 'CLOSED'}
            >
              {ballotStatus === 'CLOSED' ? 'Ballot Closed' : 
               hasVoted ? 'Vote Submitted' : 'Submit Vote'}
            </button>
          </div>
          <QRViewer
            isOpen={qrModalOpen}
            onClose={() => setQrModalOpen(false)}
            qrCode={ballotQRCode || ''}
            ballotName={ballotName}
          />
        </div>
      </div>
    </>
  );
};

export default ViewBallotPage;

