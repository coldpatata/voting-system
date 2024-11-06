import { FC } from 'react';

const PositionPage: FC = () => {
  return (
    <>
      {' '}
      <div className="bg-blue-900 p-4 text-white">
        <h1 className="text-xl">Good Day!</h1>
      </div>
      <div className="min-h-screen bg-gray-200 p-8">
        <div className="bg-blue-900 text-white p-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl font-bold mb-2 md:mb-0">Position</h1>
          <div className="flex items-center space-x-2">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded">
              Add
            </button>
            <div className="flex">
              <input
                type="text"
                className="px-2 py-1 rounded-tl-lg rounded-bl-lg text-black"
              />
              <button className="bg-yellow-400 w-1/4 p-2">Search</button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-gray-300">
                <th className="py-2 px-4 border">Designation</th>
                <th className="py-2 px-4 border">Max Vote Count</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'President', name: 1 },
                { id: 'Vice-President', name: 1 },
                { id: 'Secretary', name: 1 },
                { id: 'Treasurer', name: 1 },
                { id: 'Auditor', name: 1 },
                { id: 'P.I.O', name: 1 },
                { id: "People's Choice Award", name: 1 },
                { id: 'Best in Costume', name: 1 },
                { id: 'Representative', name: 1 },
              ].map((candidate) => (
                <tr key={candidate.id} className="text-center">
                  <td className="py-2 px-4 border">{candidate.id}</td>
                  <td className="py-2 px-4 border">{candidate.name}</td>

                  <td className="py-2 px-4 border">
                    <button className="bg-yellow-400 text-black px-4 py-2 rounded mr-2">
                      Edit
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded">
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center space-x-2 py-4">
          <button className="text-gray-600">&laquo; Previous</button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded ${
                page === 2 ? 'bg-blue-900 text-white' : 'text-gray-600'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="text-gray-600">Next &raquo;</button>
        </div>
      </div>
      ;
    </>
  );
};

export default PositionPage;
