import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../../components/header/header';
import { useNavigate } from 'react-router-dom';

interface Ballot {
  ballot_id: number;
  ballot_name: string;
  opening_date: string;
  closing_date: string;
  status: string;
}

const BallotReportPage: FC = () => {
  const [ballots, setBallots] = useState<Ballot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/ballot/getAllBallots')
      .then((response) => {
        setBallots(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching ballots:', error);
      });
  }, []);

  const filteredBallots = ballots.filter((ballot) =>
    ballot.ballot_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-200 p-8">
        <div className="bg-blue-900 text-white p-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl font-bold mb-2 md:mb-0">Ballot Report</h1>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-2 py-1 rounded text-black"
            />
            <button className="bg-yellow-400 text-black px-4 py-2 rounded">
              Search
            </button>
          </div>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-gray-300">
                <th className="py-2 px-4 border">Ballot Name</th>
                <th className="py-2 px-4 border">Date Created</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBallots.map((ballot) => (
                <tr key={ballot.ballot_id} className="text-center">
                  <td className="py-2 px-4 border">{ballot.ballot_name}</td>
                  <td className="py-2 px-4 border">
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date(ballot.opening_date))}
                  </td>
                  <td className="py-2 px-4 border">{ballot.status}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => navigate(`/admin/ballot-report/view/${ballot.ballot_id}`)}
                      className="bg-yellow-400 text-black px-4 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BallotReportPage;
