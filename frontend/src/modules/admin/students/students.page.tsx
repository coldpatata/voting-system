import { FC } from 'react';
import Header from '../../../components/header/header';

const StudentPage: FC = () => {
  return (
    <>
      {' '}
      <Header />
      <div className="min-h-screen bg-gray-200 p-4">
        <div className="bg-blue-800 text-white p-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl font-bold mb-2 md:mb-0">Students</h1>

          <div className="flex items-center">
            <div className="mr-2">
              <button className="bg-yellow-400 text-black p-2 ml-2 rounded">
                Add Student
              </button>
            </div>

            <input type="text" className="p-2" />
            <button className="bg-yellow-400 text-black p-2 ml-2">
              Search
            </button>
          </div>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Username</th>
                <th className="py-2 px-4 border-b">First Name</th>
                <th className="py-2 px-4 border-b">Last Name</th>
                <th className="py-2 px-4 border-b">M.Initial</th>

                <th className="py-2 px-4 border-b">Year Level</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b text-center">admin</td>
                <td className="py-2 px-4 border-b text-center">admin</td>
                <td className="py-2 px-4 border-b text-center">admin</td>
                <td className="py-2 px-4 border-b text-center">admin</td>

                <td className="py-2 px-4 border-b text-center">2nd Year</td>
                <td className="py-2 px-4 border-b flex justify-center">
                  <button className="bg-yellow-400 text-black px-4 py-1 rounded">
                    View
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-center">admin</td>
                <td className="py-2 px-4 border-b text-center">admin</td>
                <td className="py-2 px-4 border-b text-center">admin</td>
                <td className="py-2 px-4 border-b text-center">admin</td>

                <td className="py-2 px-4 border-b text-center">2nd Year</td>
                <td className="py-2 px-4 border-b flex justify-center">
                  <button className="bg-yellow-400 text-black px-4 py-1 rounded">
                    View
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-center">admin</td>
                <td className="py-2 px-4 border-b text-center">admin</td>
                <td className="py-2 px-4 border-b text-center">admin</td>
                <td className="py-2 px-4 border-b text-center">admin</td>

                <td className="py-2 px-4 border-b text-center">2nd Year</td>
                <td className="py-2 px-4 border-b flex justify-center">
                  <button className="bg-yellow-400 text-black px-4 py-1 rounded ">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center mt-4">
          <button className="px-4 py-2 mx-1 text-gray-600">« Previous</button>
          <button className="px-4 py-2 mx-1 text-gray-600">1</button>
          <button className="px-4 py-2 mx-1 text-gray-600">2</button>
          <button className="px-4 py-2 mx-1 bg-blue-800 text-white">3</button>
          <button className="px-4 py-2 mx-1 text-gray-600">4</button>
          <button className="px-4 py-2 mx-1 text-gray-600">5</button>
          <button className="px-4 py-2 mx-1 text-gray-600">Next »</button>
        </div>
      </div>
    </>
  );
};

export default StudentPage;
