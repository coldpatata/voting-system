import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Header from '../../../components/header/header';

const CreateFeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    content: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const user_id = localStorage.getItem('uid');

    if (!user_id) {
      Swal.fire({
        title: 'Error',
        text: 'You must be logged in to submit feedback',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      const payload = {
        ...formData,
        user_id: Number(user_id)
      };

      console.log('Submitting feedback:', payload);

      const response = await axios.post('http://localhost:5000/api/feedback/createFeedback', payload);

      if (response.status === 201) {
        Swal.fire({
          title: 'Success!',
          text: 'Feedback submitted successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/student/feedbacks');
        });
      }
    } catch (error: any) {
      console.error('Feedback submission error:', error.response?.data || error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to submit feedback',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
          <div className="bg-blue-800 text-white px-6 py-4 rounded-t-lg">
            <h1 className="text-xl font-bold">Submit Feedback</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/student/feedbacks')}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 text-white rounded ${
                  isLoading ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {isLoading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateFeedbackPage;
