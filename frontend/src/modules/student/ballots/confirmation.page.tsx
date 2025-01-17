import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../components/header/header';

interface LocationState {
  ballotName: string;
  submitDate: string;
}

const BallotConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ballotName, submitDate } = (location.state as LocationState) || {
    ballotName: 'Unknown Ballot',
    submitDate: new Date().toLocaleString()
  };

  // Redirect if accessed directly without state
  React.useEffect(() => {
    if (!location.state) {
      navigate('/student/ballot');
    }
  }, [location.state, navigate]);

  return (
    <>
      <Header />
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="mb-4 text-green-500">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Vote Submitted Successfully!</h2>
          <div className="text-gray-600 mb-6">
            <p className="mb-2">Your vote for "{ballotName}" has been recorded.</p>
            <p className="text-sm">Submitted on: {submitDate}</p>
            <p className="mt-4 text-yellow-600">
              For security reasons, you cannot view or modify your submission.
            </p>
          </div>
          <button
            onClick={() => navigate('/student/ballot')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Return to Ballots
          </button>
        </div>
      </div>
    </>
  );
};

export default BallotConfirmation;
