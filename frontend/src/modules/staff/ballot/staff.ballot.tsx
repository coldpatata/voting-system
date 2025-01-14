import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddBallotModal from '../../../components/modal/ballot modal/add-ballot';
import BallotReportModal from '../../../components/modal/ballot-report';
import EditBallotModal from '../../../components/modal/ballot modal/edit-ballot';

interface Ballot {
  ballot_id: number;
  ballot_name: string;
  opening_date: string;
  closing_date: string;
}

const StaffBallotPage: FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ballots, setBallots] = useState<Ballot[]>([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Define itemsPerPage
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBallot, setSelectedBallot] = useState<Ballot | null>(null);

  const openModall = () => setModalOpen(true);
  const closeModall = () => setModalOpen(false);

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

  useEffect(() => {
    fetchBallots();
  }, []);

  const handleEdit = (ballot: Ballot) => {
    setSelectedBallot(ballot);
    setEditModalOpen(true);
  };

  const handleUpdate = () => {
    // Refresh the ballots list
    fetchBallots();
  };

  const filteredBallots = ballots.filter((ballot) =>
    ballot.ballot_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 p-4 text-white">
        <h1 className="text-xl">Good Day!</h1>
      </div>

      {/* Main Content */}
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
              className="border border-gray-300 px-2 py-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                        onClick={() => navigate(`/staff/view-ballot/${ballot.ballot_id}`)}
                        className="bg-yellow-400 px-2 py-1 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(ballot)}
                        className="bg-green-500 px-2 py-1 text-white rounded"
                      >
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
          {filteredBallots.length > itemsPerPage && (
            <>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-2 py-1 bg-gray-300 rounded"
              >
                &laquo; Previous
              </button>
              {[...Array(Math.ceil(filteredBallots.length / itemsPerPage))].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-2 py-1 rounded ${
                    currentPage === idx + 1 ? 'bg-blue-900 text-white' : 'bg-gray-300'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(filteredBallots.length / itemsPerPage))
                  )
                }
                className="px-2 py-1 bg-gray-300 rounded"
              >
                Next &raquo;
              </button>
            </>
          )}
        </div>
      </div>

      <AddBallotModal isOpen={isModalOpen} onClose={closeModall} />
      <BallotReportModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
      {selectedBallot && (
        <EditBallotModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          ballotId={selectedBallot.ballot_id}
          currentBallotName={selectedBallot.ballot_name}
          currentOpeningDate={selectedBallot.opening_date}
          currentClosingDate={selectedBallot.closing_date}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default StaffBallotPage;
