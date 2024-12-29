import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../../components/header/header';
import Swal from 'sweetalert2';

interface Student {
  username: string;
  first_name: string;
  last_name: string;
  middle_initial: string;
  year_level: string;
}

const StudentPage: FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [file, setFile] = useState<File | null>(null); // File state
  const [uploadError, setUploadError] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/users/getStudentDetails'
        );
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (err) {
        setError('Failed to fetch student details. Please try again later.');
        console.error(err);
      }
    };
    fetchStudents();
  }, []);

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    const term = searchTerm.toLowerCase();
    const filtered = students.filter(
      (student) =>
        student.username.toLowerCase().includes(term) ||
        student.first_name.toLowerCase().includes(term) ||
        student.last_name.toLowerCase().includes(term)
    );
    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setUploadError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(
        'http://localhost:5000/api/users/importStudents',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setUploadError('');
      setIsModalOpen(false);
      const response = await axios.get(
        'http://localhost:5000/api/users/getStudentDetails'
      );
      setStudents(response.data);
      setFilteredStudents(response.data);

      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'Students have been successfully imported!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (err) {
      console.error(err);
      setUploadError('Failed to upload file. Please try again.');
      // Show error message
      Swal.fire({
        title: 'Error!',
        text: 'Failed to upload the file. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-200 p-4">
        <div className="bg-blue-800 text-white p-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl font-bold mb-2 md:mb-0">Students</h1>
          <div className="flex items-center">
            <button
              onClick={() => setIsModalOpen(true)} // Open the modal
              className="bg-yellow-400 text-black p-2 ml-2 rounded"
            >
              Add Student
            </button>
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
                <th className="py-2 px-4 border-b">Year Level</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b text-center">
                      {student.username}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {student.first_name}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {student.last_name}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {student.middle_initial}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {student.year_level}
                    </td>
                    <td className="py-2 px-4 border-b flex justify-center gap-3">
                      <button className="bg-yellow-400 text-black px-4 py-1 rounded">
                        View
                      </button>
                      <button className="bg-red-600 text-white px-4 py-1 rounded">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 px-4 border-b text-center" colSpan={6}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center mt-4">
          {filteredStudents.length > itemsPerPage && (
            <div>
              {Array.from(
                { length: Math.ceil(filteredStudents.length / itemsPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 mx-1 ${
                      currentPage === i + 1
                        ? 'bg-blue-800 text-white'
                        : 'text-gray-600'
                    }`}
                    disabled={i + 1 === currentPage} // Disable the current page button
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Import Students</h2>
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="mb-4"
            />
            {uploadError && (
              <div className="text-red-600 text-sm mb-2">{uploadError}</div>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-blue-800 text-white rounded"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentPage;
