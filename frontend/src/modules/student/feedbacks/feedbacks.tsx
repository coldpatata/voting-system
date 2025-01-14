import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/header/header';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Feedback {
  id: number;
  subject: string;
  content: string;
  created_at: string;
  status: string;
}

const Feedbacks: FC = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUserFeedbacks();
  }, []);

  const fetchUserFeedbacks = async () => {
    try {
      const user_id = localStorage.getItem('uid');
      const response = await axios.get(`http://localhost:5000/api/feedback/user/${user_id}`);
      setFeedbacks(response.data.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const handleViewFeedback = (feedback: Feedback) => {
    Swal.fire({
      title: feedback.subject,
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Status:</strong> ${feedback.status}</p>
          <p class="mb-2"><strong>Date:</strong> ${new Date(feedback.created_at).toLocaleDateString()}</p>
          <div class="mt-4">
            <strong>Content:</strong>
            <p class="mt-2 p-3 bg-gray-100 rounded">${feedback.content}</p>
          </div>
        </div>
      `,
      confirmButtonText: 'Close'
    });
  };

  const filteredFeedbacks = feedbacks.filter(feedback =>
    feedback.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-200 p-4">
        <div className="bg-blue-800 text-white p-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl font-bold mb-2 md:mb-0">My Feedbacks</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/student/create-feedback')}
              className="bg-yellow-400 text-black px-4 py-2 rounded"
            >
              Submit Feedback
            </button>
            <div className="flex">
              <input
                type="text"
                className="px-2 py-1 rounded-l text-black"
                placeholder="Search feedbacks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-yellow-400 text-black px-4 rounded-r">
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Subject</th>
                <th className="py-2 px-4 border-b">Date Submitted</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((feedback) => (
                <tr key={feedback.id} className="text-center">
                  <td className="py-2 px-4 border-b">{feedback.subject}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      feedback.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      feedback.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {feedback.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleViewFeedback(feedback)}
                      className="bg-yellow-400 text-black px-4 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Feedbacks;
