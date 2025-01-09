import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface TallyResult {
  position: string;
  candidate_id: number;
  participant_name: string;
  vote_count: number;
}

interface VoteTallyProps {
  ballotId: number; // ID of the ballot to fetch the tally for
}

const VoteTally: React.FC<VoteTallyProps> = ({ ballotId }) => {
  const [tally, setTally] = useState<Record<string, TallyResult[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVoteTally(ballotId);
  }, [ballotId]);

  const fetchVoteTally = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:5000/api/vote/getVoteTally?ballot_id=${id}`
      );
      const groupedTally = response.data.data.reduce(
        (acc: Record<string, TallyResult[]>, vote: TallyResult) => {
          if (!acc[vote.position]) {
            acc[vote.position] = [];
          }
          acc[vote.position].push(vote);
          return acc;
        },
        {}
      );
      setTally(groupedTally);
    } catch (error) {
      console.error('Error fetching vote tally:', error);
      setError('Failed to fetch vote tally. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p className="text-center">Loading vote tally...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold text-center mb-4">Vote Tally</h2>
      {Object.entries(tally).map(([position, candidates]) => (
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
      ))}
    </div>
  );
};

export default VoteTally;
