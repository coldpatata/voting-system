import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../../components/header/header';
import AddStaff from '../../../components/modal/staff modal/add-staff';

interface Staff {
  username: string;
  first_name: string;
  last_name: string;
  middle_initial: string;
}

const StaffPage: FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/users/getStaffDetails'
        );
        setStaff(response.data);
        setFilteredStaff(response.data);
      } catch (err) {
        setError('Failed to fetch staff details. Please try again later.');
        console.error(err);
      }
    };
    fetchStaff();
  }, []);

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    const term = searchTerm.toLowerCase();
    const filtered = staff.filter(
      (s) =>
        s.username.toLowerCase().includes(term) ||
        s.first_name.toLowerCase().includes(term) ||
        s.last_name.toLowerCase().includes(term)
    );
    setFilteredStaff(filtered);
    setCurrentPage(1); 
  };

  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleAddStaff = (studentData: Record<string, string>) => {
    const newStaff: Staff = {
      username: studentData.username,
      first_name: studentData.first_name,
      last_name: studentData.last_name,
      middle_initial: studentData.middle_initial,
    };
    setStaff((prev) => [...prev, newStaff]);
    setFilteredStaff((prev) => [...prev, newStaff]);
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-200 p-4">
        <div className="bg-blue-800 text-white p-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl font-bold mb-2 md:mb-0">Staff</h1>
          <div className="flex items-center">
            <button
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="bg-yellow-400 text-black p-2 ml-2 rounded"
            >
              Add Staff
            </button>
            <AddStaff
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleAddStaff}
            />
            <input
              type="text"
              className="p-2 ml-4 text-black"
              placeholder="Search..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto mt-4">
          {error && (
            <div className="bg-red-200 text-red-800 p-4 mb-4 rounded">
              {error}
            </div>
          )}
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Username</th>
                <th className="py-2 px-4 border-b">First Name</th>
                <th className="py-2 px-4 border-b">Last Name</th>
                <th className="py-2 px-4 border-b">M. Initial</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStaff.length > 0 ? (
                paginatedStaff.map((staffMember, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b text-center">
                      {staffMember.username}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {staffMember.first_name}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {staffMember.last_name}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {staffMember.middle_initial}
                    </td>
                    <td className="py-2 px-4 border-b flex justify-center gap-2">
                      <button className="bg-yellow-400 text-black px-4 py-1 rounded">
                        View
                      </button>
                      <button className="bg-red-600 text-black px-4 py-1 rounded">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 px-4 border-b text-center" colSpan={5}>
                    No staff found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center mt-4">
          {Array.from(
            { length: Math.ceil(filteredStaff.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 mx-1 ${
                  currentPage === i + 1
                    ? 'bg-blue-800 text-white'
                    : 'text-gray-600'
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default StaffPage;
