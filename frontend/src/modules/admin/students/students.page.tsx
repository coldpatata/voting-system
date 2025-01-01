import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../../components/header/header';
import Swal from 'sweetalert2';
import AddStudentModal from '../../../components/modal/student modal/add-student';
import EditStudent from '../../../components/modal/student modal/edit-student';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        setError('No records of student');
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

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleAddStudent = (studentData: Record<string, string>) => {
    const newStudent: Student = {
      username: studentData.username,
      first_name: studentData.first_name,
      last_name: studentData.last_name,
      middle_initial: studentData.middle_initial,
      year_level: studentData.year_level,
    };
    setStudents((prev) => [...prev, newStudent]);
    setFilteredStudents((prev) => [...prev, newStudent]);
    setIsModalOpen(false);

    Swal.fire({
      title: 'Student Added',
      text: 'The student has been successfully added.',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-200 p-4">
        <div className="bg-blue-800 text-white p-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl font-bold mb-2 md:mb-0">Students</h1>
          <div className="flex items-center">
            <button
              onClick={() => setIsModalOpen(true)} // Open the modal
              className="bg-yellow-400 text-black p-2  rounded"
            >
              Add Student
            </button>
            <AddStudentModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleAddStudent}
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
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-yellow-400 text-black px-4 py-1 rounded"
                      >
                        View
                      </button>
                      <EditStudent
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                      />
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
    </>
  );
};

export default StudentPage;
