import axios from 'axios';
import { FC, useState } from 'react';
import Swal from 'sweetalert2';

interface CreateFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subject: string, content: string) => void;
}

const CreateFeedback: FC<CreateFeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleSubmit = async () => {
    try {
      const feedbackData = {
        subject: subject,
        content: content,
      };

      const createResponse = await axios.post(
        'http://localhost:5000/api/feedback/createFeedback',
        feedbackData
      );

      if (createResponse.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Feedback created successfully!',
        }).then(() => {
          onSubmit(subject, content);
          onClose();
          window.location.reload();
        });
      } else {
        throw new Error('Failed to create feedbacks');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error occured while submitting feedbacks',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <h2 className="bg-blue-900 text-white py-2 px-4 rounded-t-md">
          Create Feedback
        </h2>
        <div className="mt-4">
          <label className="block font-bold">Subject</label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-md w-full"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block font-bold">Content</label>
          <textarea
            className="border border-gray-300 p-2 rounded-md w-full h-32"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFeedback;
