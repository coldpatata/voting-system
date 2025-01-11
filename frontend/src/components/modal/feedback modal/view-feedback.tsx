import { FC } from 'react';

interface Feedback {
  subject: string;
  content: string;
}

interface ViewFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFeedback: Feedback | null;
}

const ViewFeedbackModal: FC<ViewFeedbackModalProps> = ({
  isOpen,
  onClose,
  selectedFeedback,
}) => {
  if (!isOpen) return null; // Don't render if modal is not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-6 bg-white rounded-md shadow-lg w-full max-w-md">
        <h2 className="bg-blue-900 text-white py-2 px-4 rounded-t-md">
          View Feedback
        </h2>
        <div className="mt-4">
          <h3 className="font-bold">Subject</h3>
          <p className="bg-gray-200 p-2 rounded-md">
            {selectedFeedback?.subject || 'No subject provided'}
          </p>
        </div>
        <div className="mt-4">
          <h3 className="font-bold">Content</h3>
          <p className="bg-gray-200 p-2 rounded-md">
            {selectedFeedback?.content || 'No content provided'}
          </p>
        </div>
        <button
          className="mt-4 bg-blue-900 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewFeedbackModal;
