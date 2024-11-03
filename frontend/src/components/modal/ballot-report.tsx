// BallotReportModal.tsx
import React from 'react';

interface BallotReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BallotReportModal: React.FC<BallotReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-4xl">
        {/* Modal Header */}
        <div className="bg-blue-800 text-white text-lg font-bold p-4 rounded-t-lg flex justify-between">
          <span>2024 SSLG Election</span>
          <button onClick={onClose} className="text-white text-xl">
            &times;
          </button>
        </div>

        {/* Election Results */}
        <div className="p-4 bg-white shadow-md rounded-lg mb-8">
          <div className="bg-blue-800 text-white text-lg font-bold p-2 rounded-t-lg">
            2024 SSLG Election
          </div>
          <table className="min-w-full bg-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Position</th>
                <th className="py-2 px-4 border-b text-left">Candidate</th>
                <th className="py-2 px-4 border-b text-left">Total Votes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b text-left">President</td>
                <td className="py-2 px-4 border-b text-left">Emma Carter</td>
                <td className="py-2 px-4 border-b text-left">357</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-left">V-President</td>
                <td className="py-2 px-4 border-b text-left">Liam Reynolds</td>
                <td className="py-2 px-4 border-b text-left">498</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-left">Secretary</td>
                <td className="py-2 px-4 border-b text-left">Noah Brooks</td>
                <td className="py-2 px-4 border-b text-left">456</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Vote Tally */}
        <div className="p-4 bg-white shadow-md rounded-lg">
          <div className="bg-blue-800 text-white text-lg font-bold p-2 rounded-t-lg">
            Vote Tally
          </div>
          <table className="min-w-full bg-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Position</th>
                <th className="py-2 px-4 border-b text-left">Candidate</th>
                <th className="py-2 px-4 border-b text-left">Total Votes</th>
                <th className="py-2 px-4 border-b text-left">
                  Voter Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b text-left">President</td>
                <td className="py-2 px-4 border-b text-left">Emma Carter</td>
                <td className="py-2 px-4 border-b text-left">357</td>
                <td className="py-2 px-4 border-b text-left">59.5%</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-left">President</td>
                <td className="py-2 px-4 border-b text-left">Sophia Bennett</td>
                <td className="py-2 px-4 border-b text-left">243</td>
                <td className="py-2 px-4 border-b text-left">40.5%</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-left">V-President</td>
                <td className="py-2 px-4 border-b text-left">Liam Reynolds</td>
                <td className="py-2 px-4 border-b text-left">347</td>
                <td className="py-2 px-4 border-b text-left">57.8%</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-left">V-President</td>
                <td className="py-2 px-4 border-b text-left">Olivia Parker</td>
                <td className="py-2 px-4 border-b text-left">253</td>
                <td className="py-2 px-4 border-b text-left">42.1%</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-left">Secretary</td>
                <td className="py-2 px-4 border-b text-left">Noah Brooks</td>
                <td className="py-2 px-4 border-b text-left">312</td>
                <td className="py-2 px-4 border-b text-left">52%</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-left">Secretary</td>
                <td className="py-2 px-4 border-b text-left">MJ Reyes</td>
                <td className="py-2 px-4 border-b text-left">288</td>
                <td className="py-2 px-4 border-b text-left">48%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BallotReportModal;
