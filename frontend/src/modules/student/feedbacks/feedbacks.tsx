import { useState } from 'react';
import ViewFeedbackModal from '../../../components/modal/feedback modal/view-feedback';
import CreateFeedbackModal from '../../../components/modal/feedback modal/create-feedback';
import Header from '../../../components/header/header';

// Define the feedback structure
interface Feedback {
  subject: string;
  content: string;
}

const Feedbacks = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );

  // Example feedback data
  const feedbackData: Feedback[] = [
    {
      subject: 'No Uniform Policy',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    },
    {
      subject: 'Event Improvement',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    },
    {
      subject: 'Need Immediate Action',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    },
  ];

  // Open View Modal
  const openViewModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsViewModalOpen(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  // Close Modals
  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="flex">
      <div className="flex-1 min-h-screen bg-gray-100">
        <Header />

        {/* Feedback Section */}
        <div className="p-6">
          <div className="  mb-6">
            <div className="flex justify-between items-center">
              <h2 className="bg-blue-900 text-white py-2 px-4 rounded-t-md">
                Feedbacks
              </h2>
              <div className="flex ">
                <button
                  className="bg-yellow-400 text-black px-4"
                  onClick={openCreateModal}
                >
                  Create
                </button>
                <input
                  type="text"
                  placeholder="Search"
                  className="border border-gray-300 px-2 py-1"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="border px-4 py-2">Subject</th>
                  <th className="border px-4 py-2">Date Submitted</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbackData.map((feedback: Feedback, index: number) => (
                  <tr key={index} className="border">
                    <td className="border px-4 py-2">{feedback.subject}</td>
                    <td className="border px-4 py-2">01/13/2024</td>
                    <td className="border px-4 py-2">
                      <button
                        className="bg-yellow-400 px-4 py-1 rounded"
                        onClick={() => openViewModal(feedback)}
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

        <ViewFeedbackModal
          isOpen={isViewModalOpen}
          onClose={closeModals}
          selectedFeedback={selectedFeedback}
        />

        <CreateFeedbackModal
          isOpen={isCreateModalOpen}
          onClose={closeModals}
          onSubmit={(subject: string, content: string): void => {
            console.log('Subject:', subject);
            console.log('Content:', content);

            closeModals();
          }}
        />
      </div>
    </div>
  );
};

export default Feedbacks;
