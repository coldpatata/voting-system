import { FC, useState, useEffect } from 'react';
import axios from 'axios';

interface BallotReport {
  ballot_id: string;
  ballot_name: string;
  date_created: string;
  status: string;
}

const StaffBallotReportPage: FC = () => {
  const [reports, setReports] = useState<BallotReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<BallotReport[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ballot/reports');
        setReports(response.data);
        setFilteredReports(response.data);
      } catch (err) {
        setError('Error fetching ballot reports');
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    const filtered = reports.filter(
      (report) => report.ballot_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(filtered);
    setCurrentPage(1);
  };

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="bg-blue-900 p-4 text-white">
        <h1 className="text-xl">Good Day!</h1>
      </div>
      <div className="min-h-screen bg-gray-200 p-4">
        <div className="bg-blue-800 text-white p-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl font-bold mb-2 md:mb-0">Ballot Report</h1>
          <div className="flex items-center">
            <input
              type="text"
              className="p-2"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button className="bg-yellow-400 text-black p-2 ml-2">
              Search
            </button>
          </div>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Ballot Name</th>
                <th className="py-2 px-4 border-b">Date Created</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.map((report) => (
                <tr key={report.ballot_id}>
                  <td className="py-2 px-4 border-b">{report.ballot_name}</td>
                  <td className="py-2 px-4 border-b">{report.date_created}</td>
                  <td className="py-2 px-4 border-b">{report.status}</td>
                  <td className="py-2 px-4 border-b">
                    <button className="bg-yellow-400 text-black px-4 py-1">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center mt-4">
          <button
            className="px-4 py-2 mx-1 text-gray-600"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            « Previous
          </button>
          {Array.from(
            { length: Math.ceil(filteredReports.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i + 1}
                className={`px-4 py-2 mx-1 ${
                  currentPage === i + 1
                    ? 'bg-blue-800 text-white'
                    : 'text-gray-600'
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            )
          )}
          <button
            className="px-4 py-2 mx-1 text-gray-600"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(filteredReports.length / itemsPerPage))
              )
            }
          >
            Next »
          </button>
        </div>
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </>
  );
};

export default StaffBallotReportPage;
