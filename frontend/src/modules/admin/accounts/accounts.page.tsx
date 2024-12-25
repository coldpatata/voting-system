import { FC, useEffect, useState } from 'react';
import axios from 'axios';

const AccountsPage: FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const pollingInterval = 5000; // Poll every 5 seconds

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const limit = 10;
      const response = await axios.get(
        `http://localhost:5000/api/users/getUsersWithRoles?page=${page}&limit=${limit}`
      );
      setUsers(response.data.data);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (userId: string, currentStatus: string) => {
    try {
      const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const requestBody = {
        user_id: userId,
        status: updatedStatus,
      };
      const response = await axios.put(
        'http://localhost:5000/api/users/updateUserStatus',
        requestBody
      );
      if (response.status === 200) {
        await fetchUsers(currentPage); // Refresh data after updating status
      } else {
        alert('SERVER ERROR');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (searchQuery.trim() === '' && selectedRole.trim() === '') {
          await fetchUsers(currentPage);
        } else if (selectedRole.trim() !== '') {
          const response = await axios.get(
            `http://localhost:5000/api/users/searchUsersByRole?role_name=${selectedRole}`
          );
          setUsers(response.data);
        } else {
          const limit = 5;
          const response = await axios.get(
            `http://localhost:5000/api/users/searchUsers?username=${searchQuery}&page=${currentPage}&limit=${limit}`
          );
          setUsers(response.data.data);
          setCurrentPage(response.data.currentPage);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Polling mechanism
    const intervalId = setInterval(() => {
      if (users.length === 0 && !loading) {
        loadData();
      }
    }, pollingInterval);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [currentPage, loading, searchQuery, selectedRole, users.length]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <>
      <div className="bg-blue-900 p-4 text-white">
        <h1 className="text-xl">Good Day!</h1>
      </div>
      <div className="min-h-screen bg-gray-200 p-4">
        <div className="bg-blue-800 text-white p-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl font-bold mb-2 md:mb-0">Accounts</h1>
          <div className="flex items-center space-x-4">
            <select
              className="p-2 text-black"
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="student">Student</option>
            </select>
            <div className="flex items-center">
              <input
                type="text"
                className="p-2 text-black"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Username</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b text-center">
                      {user.username}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {user.email}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {user.role.role_name}
                    </td>
                    <td
                      className={`py-2 px-4 border-b text-center uppercase ${
                        user.status === 'active'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {user.status}
                    </td>
                    <td className="py-2 gap-2 px-4 border-b flex justify-center">
                      <button className="bg-green-400 text-black px-4 py-1 rounded">
                        Edit
                      </button>
                      <button
                        onClick={() => handleArchive(user.user_id, user.status)}
                        className={`px-4 py-1 rounded ${
                          user.status === 'active'
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        {user.status === 'active' ? 'Archive' : 'Unarchive'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 mx-1 text-gray-600"
            disabled={currentPage === 1}
          >
            « Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 mx-1 ${
                currentPage === page
                  ? 'bg-blue-800 text-white'
                  : 'text-gray-600'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 mx-1 text-gray-600"
            disabled={currentPage === totalPages}
          >
            Next »
          </button>
        </div>
      </div>
    </>
  );
};

export default AccountsPage;
