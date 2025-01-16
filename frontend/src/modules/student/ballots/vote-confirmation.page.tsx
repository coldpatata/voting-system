import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../components/header/header';

const VoteConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ballotName } = location.state || { ballotName: 'the ballot' };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Vote Submitted Successfully
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Your vote for {ballotName} has been recorded. Thank you for participating!
                </p>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate('/student/ballot')}
                >
                  Return to Ballots
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoteConfirmationPage;
