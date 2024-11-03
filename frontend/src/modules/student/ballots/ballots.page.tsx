import { FC, useState } from 'react';
import BallotReportModal from '../../../components/modal/ballot-report';

const BallotPage: FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
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
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-l-md px-2 py-1"
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
                <th className="border px-4 py-2">Opening Date</th>
                <th className="border px-4 py-2">Closing Date</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border">
                <td className="border px-4 py-2">2024 SSLG Election</td>
                <td className="border px-4 py-2">01/16/2024 - 12:00 AM</td>
                <td className="border px-4 py-2">01/18/2024 - 06:59 PM</td>
                <td className="border px-4 py-2">Open</td>
                <td className="border px-4 py-2 flex justify-center space-x-2">
                  <button
                    className="bg-yellow-400 px-2 py-1 rounded"
                    onClick={openModal}
                  >
                    View
                  </button>
                  <button className="bg-green-500 px-2 py-1 text-white rounded">
                    Done
                  </button>
                </td>
              </tr>
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

      {/* Ballot Report Modal */}
      <BallotReportModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
    </div>
  );
};

export default BallotPage;
