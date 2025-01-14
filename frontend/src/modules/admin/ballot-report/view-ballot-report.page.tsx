import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/header/header';

interface Voter {
  student_name: string;
  year_level: string;
  vote_id: number;
}

interface TallyResult {
  candidate_id: number;
  participant_name: string;
  vote_count: number;
  percentage: string;
  voters: Voter[];
}

interface VoterTurnout {
  year_level: string;
  student_population: number;
  total_votes: number;
  vote_turnout_result: string;
}

interface VoteTallyResponse {
  success: boolean;
  message: string;
  data: {
    tally: Record<string, TallyResult[]>;
    turnout: VoterTurnout[];
  };
}

const ViewBallotReportPage: React.FC = () => {
  const { ballotId } = useParams<{ ballotId: string }>();
  const navigate = useNavigate();
  const [ballotName, setBallotName] = useState('');
  const [tally, setTally] = useState<Record<string, TallyResult[]>>({});
  const [turnout, setTurnout] = useState<VoterTurnout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!ballotId) return;
      
      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching data for ballot ID:', ballotId);

        const [ballotRes, tallyRes, turnoutRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/ballot/getBallotWithParticipants`, {
            params: { ballot_id: ballotId }
          }),
          axios.get(`http://localhost:5000/api/vote/getVoteTally`, {
            params: { ballot_id: ballotId }
          }),
          axios.get(`http://localhost:5000/api/vote/getTurnout`, {
            params: { ballot_id: ballotId }
          })
        ]);

        console.log('Ballot Response:', ballotRes.data);
        console.log('Tally Response:', tallyRes.data);
        console.log('Turnout Response:', turnoutRes.data);

        if (ballotRes.data?.data) {
          setBallotName(ballotRes.data.data.ballot_name);
        }

        if (tallyRes.data?.data) {
          setTally(tallyRes.data.data);
        }

        if (turnoutRes.data?.data) {
          setTurnout(turnoutRes.data.data);
        }

      } catch (err) {
        console.error('Full error details:', err);
        setError(
          err instanceof Error 
            ? err.message 
            : 'Network error occurred. Please check your connection.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ballotId]);

  console.log('Current tally state:', tally);
  console.log('Current turnout state:', turnout);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading ballot data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white shadow-lg">
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-lg font-bold">Election Report</div>
          <div className="hidden md:flex space-x-6">
            <div>Election: {ballotName}</div>
            <div onClick={() => navigate(-1)} className="cursor-pointer hover:underline">
              Back
            </div>
            <div onClick={() => window.print()} className="cursor-pointer hover:underline">
              Print
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Section 1: Election Details */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <div className="text-xl font-semibold mb-4 text-blue-900">{ballotName}</div>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-200">
                <th className="border p-2">Position</th>
                <th className="border p-2">Candidate</th>
                <th className="border p-2">Total Votes</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tally).map(([position, candidates]) => (
                candidates.map((candidate) => (
                  <tr key={candidate.candidate_id}>
                    <td className="border p-2">{position}</td>
                    <td className="border p-2">{candidate.participant_name}</td>
                    <td className="border p-2 text-center">{candidate.vote_count}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 2: Voting Tally */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <div className="text-xl font-semibold mb-4 text-blue-900">Vote Tally</div>
          {Object.entries(tally).map(([position, candidates]) => (
            <div key={position} className="mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">{position}</h3>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-blue-200">
                    <th className="border p-2">Candidate</th>
                    <th className="border p-2">Total Votes</th>
                    <th className="border p-2">Percentage</th>
                    <th className="border p-2">Voters</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate: TallyResult) => (
                    <tr key={candidate.candidate_id}>
                      <td className="border p-2">{candidate.participant_name}</td>
                      <td className="border p-2 text-center">{candidate.vote_count}</td>
                      <td className="border p-2 text-center">{candidate.percentage}%</td>
                      <td className="border p-2">
                        <div className="max-h-40 overflow-y-auto">
                          {candidate.voters && candidate.voters.length > 0 ? (
                            <ul className="list-disc pl-4">
                              {candidate.voters.map((voter) => (
                                <li key={voter.vote_id} className="text-sm">
                                  {voter.student_name} ({voter.year_level})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-500">No votes yet</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Section 3: Voter Turnout */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <div className="text-xl font-semibold mb-4 text-blue-900">Voter's Turnout</div>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-200">
                <th className="border p-2">Year Level</th>
                <th className="border p-2">Student Population</th>
                <th className="border p-2">Total Votes</th>
                <th className="border p-2">Vote Turnout Result</th>
              </tr>
            </thead>
            <tbody>
              {turnout.map((data, index) => (
                <tr key={index}>
                  <td className="border p-2">{data.year_level}</td>
                  <td className="border p-2 text-center">{data.student_population}</td>
                  <td className="border p-2 text-center">{data.total_votes}</td>
                  <td className="border p-2 text-center">{data.vote_turnout_result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-8 md:p-16 text-gray-800 text-center mt-4">
        <div className="text-2xl md:text-4xl font-semibold">
          Thank you for reviewing the report.
        </div>
        <div className="mt-6">
          <div
            onClick={() => navigate(-1)}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 cursor-pointer inline-block"
          >
            Back
          </div>
          <div
            onClick={() => window.print()}
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 cursor-pointer inline-block ml-4"
          >
            Print
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBallotReportPage;
