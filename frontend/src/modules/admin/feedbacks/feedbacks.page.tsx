import { FC, useEffect, useState } from 'react';
import Header from '../../../components/header/header';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Feedback {
  id: number;
  user: {
    first_name: string;
    last_name: string;
  };
  subject: string;
  content: string;  // Add content to interface
  created_at: string;
  status: string;
  priority: 'immediate' | 'non_immediate';
  image_url: string | null;
  rejection_reason: string | null;
  evaluation_notes: string | null;
}

const FeedbacksPage: FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all',
    search: ''
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/feedback/getAllFeedbacks');
      setFeedbacks(response.data.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load feedbacks',
        icon: 'error',
      });
    }
  };

  const handleStatusUpdate = async (feedback: Feedback, newStatus: string, notes?: string) => {
    const updateData: any = { status: newStatus };

    if (newStatus === 'rejected') {
      const { value: rejectionReason } = await Swal.fire({
        title: 'Provide Rejection Reason',
        input: 'textarea',
        inputLabel: 'Reason',
        inputPlaceholder: 'Enter reason for rejection...',
        inputValidator: (value) => !value && 'You need to provide a reason!'
      });

      if (!rejectionReason) return;
      updateData.rejection_reason = rejectionReason;
    }

    if (newStatus === 'being_evaluated') {
      updateData.evaluation_notes = notes || '';
    }

    try {
      await axios.put(`http://localhost:5000/api/feedback/updateStatus/${feedback.id}`, updateData);
      fetchFeedbacks();
      Swal.fire('Updated!', `Status changed to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  };

  const handleViewFeedback = (feedback: Feedback) => {
    const imageUrl = feedback.image_url 
      ? `https://qdqcdyopziokllxehnuq.supabase.co/storage/v1/object/public/uploads/${feedback.image_url}`
      : null;

    Swal.fire({
      title: feedback.subject,
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>From:</strong> ${feedback.user.first_name} ${feedback.user.last_name}</p>
          <p class="mb-2"><strong>Priority:</strong> ${feedback.priority}</p>
          <p class="mb-2"><strong>Status:</strong> ${feedback.status}</p>
          ${imageUrl ? `
            <div class="mt-4">
              <strong>Attached Image:</strong>
              <div class="mt-2">
                <img 
                  src="${imageUrl}" 
                  alt="Feedback attachment"
                  class="max-w-full h-auto rounded shadow-lg cursor-pointer" 
                  onclick="window.open(this.src, '_blank')"
                  style="max-height: 300px; object-fit: contain;"
                />
              </div>
            </div>
          ` : ''}
          <div class="mt-4">
            <strong>Content:</strong>
            <p class="mt-2 p-3 bg-gray-100 rounded">${feedback.content}</p>
          </div>
          ${feedback.rejection_reason ? `
            <div class="mt-4">
              <strong>Rejection Reason:</strong>
              <p class="mt-2 p-3 bg-red-100 rounded">${feedback.rejection_reason}</p>
            </div>
          ` : ''}
          ${feedback.evaluation_notes ? `
            <div class="mt-4">
              <strong>Evaluation Notes:</strong>
              <p class="mt-2 p-3 bg-yellow-100 rounded">${feedback.evaluation_notes}</p>
            </div>
          ` : ''}
        </div>
      `,
      width: '800px',
      showCloseButton: true,
      showDenyButton: feedback.status !== 'rejected',
      showCancelButton: feedback.status !== 'resolved',
      confirmButtonText: feedback.status === 'being_evaluated' ? 'Resolve' : 'Evaluate',
      denyButtonText: 'Reject',
      cancelButtonText: 'Close',
      customClass: {
        popup: 'swal2-overflow',
        image: 'max-h-96 object-contain'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (feedback.status === 'being_evaluated') {
          handleStatusUpdate(feedback, 'resolved');
        } else {
          handleStatusUpdate(feedback, 'being_evaluated');
        }
      } else if (result.isDenied) {
        handleStatusUpdate(feedback, 'rejected');
      }
    });
  };

  const filteredFeedbacks = feedbacks.filter(feedback =>
    feedback.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
    `${feedback.user.first_name} ${feedback.user.last_name}`.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-200 p-4">
        <div className="bg-blue-800 text-white p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <h1 className="text-xl font-bold">Feedbacks</h1>
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="p-2 rounded text-black"
              >
                <option value="all">All Priorities</option>
                <option value="immediate">Immediate</option>
                <option value="non_immediate">Non-Immediate</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="p-2 rounded text-black"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="being_evaluated">Being Evaluated</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="p-2 rounded text-black"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">User</th>
                <th className="py-2 px-4 border-b">Subject</th>
                <th className="py-2 px-4 border-b">Date Submitted</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Preview</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((feedback) => (
                <tr key={feedback.id} className="text-center">
                  <td className="py-2 px-4 border-b">
                    {feedback.user.first_name} {feedback.user.last_name}
                  </td>
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
                    {feedback.content.substring(0, 50)}...
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleViewFeedback(feedback)}
                        className="bg-yellow-400 text-black px-4 py-1 rounded"
                      >
                        View
                      </button>
                      {feedback.image_url && (
                        <span className="text-blue-500 text-sm">📎</span>
                      )}
                    </div>
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

export default FeedbacksPage;
