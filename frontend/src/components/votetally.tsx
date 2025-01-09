import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface VoteTallyResponse {
  data: TallyResult[];
}

interface TallyResult {
  position: string;
  candidate_id: number;
  participant_name: string;
}

interface Candidate {
  candidate_id: number;
  participant_name: string;
  vote_count: number;
}

interface VoteTallyProps {
  ballotId: number; // ID of the ballot to fetch the tally for
}

const VoteTally: React.FC<VoteTallyProps> = ({ ballotId }) => {
  const [tally, setTally] = useState<Record<string, Candidate[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVoteTally(ballotId);
  }, [ballotId]);

  const fetchVoteTally = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get<VoteTallyResponse>(
        `http://localhost:5000/api/vote/getVoteTally?ballot_id=${id}`
      );

      const voteCount = response.data.data.reduce(
        (acc: Record<string, Candidate[]>, vote) => {
          const { position, candidate_id, participant_name } = vote;

          if (!acc[position]) {
            acc[position] = []; 
          }

          const existingCandidate = acc[position].find(
            (candidate) => candidate.candidate_id === candidate_id
          );

          if (existingCandidate) {
            existingCandidate.vote_count += 1; // Increment vote count
          } else {
            acc[position].push({
              candidate_id,
              participant_name,
              vote_count: 1, // Initialize vote count
            });
          }

          return acc;
        },
        {}
      );

      setTally(voteCount);
    } catch (error) {
      console.error('Error fetching vote tally:', error);
      setError('Failed to fetch vote tally. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p className="text-center">Loading vote tally...</p>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={() => fetchVoteTally(ballotId)}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold text-center mb-4">Vote Tally</h2>
      {Object.entries(tally).length === 0 ? (
        <p className="text-center text-gray-500">No votes available.</p>
      ) : (
        Object.entries(tally).map(([position, candidates]) => (
          <div key={position} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700">{position}</h3>
            <ul className="mt-2 space-y-2">
              {candidates.map((candidate) => (
                <li
                  key={candidate.candidate_id}
                  className="flex justify-between items-center border p-2 rounded-md"
                >
                  <span>{candidate.participant_name}</span>
                  <span className="text-sm text-gray-500">
                    {candidate.vote_count} votes
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default VoteTally;
