import { FC } from 'react';
import Header from '../../../components/header/header';

const FeedbacksPage: FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-200 p-4">
        <div className="bg-blue-800 text-white p-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl font-bold mb-2 md:mb-0">Feedbacks</h1>
          <div className="flex items-center">
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
                <th className="py-2 px-4 border-b">User ID</th>
                <th className="py-2 px-4 border-b">Subject</th>
                <th className="py-2 px-4 border-b">Date Submitted</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="">
                <td className="py-2 px-4 border-b">2024 SSLG Election</td>
                <td className="py-2 px-4 border-b text-center">01/13/2024</td>
                <td className="py-2 px-4 border-b text-center">Closed</td>
                <td className="py-2 px-4 border-b flex justify-center">
                  <button className="bg-yellow-400 text-black px-4 py-1 ">
                    View
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  Buwan ng Wika People's Choice Award
                </td>
                <td className="py-2 px-4 border-b text-center">03/24/2024</td>
                <td className="py-2 px-4 border-b text-center">Closed</td>
                <td className="py-2 px-4 border-b flex justify-center">
                  <button className="bg-yellow-400 text-black px-4 py-1">
                    View
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Best Artwork</td>
                <td className="py-2 px-4 border-b text-center">04/06/2024</td>
                <td className="py-2 px-4 border-b text-center">Open</td>
                <td className="py-2 px-4 border-b flex justify-center">
                  <button className="bg-yellow-400 text-black px-4 py-1">
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

export default FeedbacksPage;
