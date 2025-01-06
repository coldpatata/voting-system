import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import BallotReportModal from '../../../components/modal/ballot-report';
import AddBallotModal from '../../../components/modal/add-ballot';
import ViewBallot from '../../../components/modal/view-ballot';
import Header from '../../../components/header/header';

const BallotPageAdmin: FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isViewOpen, setViewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ballots, setBallots] = useState<Ballot[]>([]);

  interface Ballot {
    ballot_id: number;
    ballot_name: string;
    opening_date: string; // ISO date string from the API
    closing_date: string; // ISO date string from the API
  }

  const openModall = () => setModalOpen(true);
  const closeModall = () => setModalOpen(false);
  const openViewModal = () => setViewOpen(true);
  const closeViewModal = () => setViewOpen(false);

  // Fetch ballots from API
  useEffect(() => {
    const fetchBallots = async () => {
      try {
        const response = await axios.get<{ data: Ballot[] }>(
          'http://localhost:5000/api/ballot/getAllBallots'
        );
        setBallots(response.data.data);
      } catch (error) {
        console.error('Error fetching ballots:', error);
      }
    };

    fetchBallots();
  }, []);

  // Filter ballots by search query
  const filteredBallots = ballots.filter((ballot) =>
    ballot.ballot_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="bg-blue-900 text-white py-2 px-4 rounded-t-md">
            Ballots
          </h2>
          <div className="flex">
            <button
              onClick={openModall}
              className="bg-yellow-400 text-black px-4"
            >
              Add
            </button>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 px-2 py-1"
            />
            <button className="bg-yellow-400 text-black rounded-r-md px-4">
              Search
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="border px-4 py-2">Ballot Name</th>
                <th className="border px-4 py-2">Date Created</th>
                <th className="border px-4 py-2">Closing Date</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBallots.length > 0 ? (
                filteredBallots.map((ballot) => (
                  <tr key={ballot.ballot_id} className="border">
                    <td className="border px-4 py-2 text-center">
                      {ballot.ballot_name}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(ballot.opening_date))}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(ballot.closing_date))}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {new Date() < new Date(ballot.closing_date)
                        ? 'Open'
                        : 'Closed'}
                    </td>
                    <td className="border px-4 py-2 flex justify-center space-x-2">
                      <button
                        onClick={openViewModal}
                        className="bg-yellow-400 px-2 py-1 rounded"
                      >
                        View
                      </button>
                      <button className="bg-red-600 px-2 py-1 text-white rounded">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    No ballots available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-2 py-4">
          <button className="px-2 py-1 bg-gray-300 rounded">
            &laquo; Previous
          </button>
          <button className="px-2 py-1 bg-gray-300 rounded">1</button>
          <button className="px-2 py-1 bg-gray-300 rounded">2</button>
          <button className="px-2 py-1 bg-blue-900 text-white rounded">
            3
          </button>
          <button className="px-2 py-1 bg-gray-300 rounded">4</button>
          <button className="px-2 py-1 bg-gray-300 rounded">5</button>
          <button className="px-2 py-1 bg-gray-300 rounded">
            Next &raquo;
          </button>
        </div>
      </div>

      <AddBallotModal isOpen={isModalOpen} onClose={closeModall} />
      <ViewBallot isOpen={isViewOpen} onClose={closeViewModal} />
      <BallotReportModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
    </div>
  );
};

export default BallotPageAdmin;
