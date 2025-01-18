import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPositionModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    position: ''

  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { position } = formData;

    try {
      const response = await axios.post('http://localhost:5000/api/position/createPosition', {
        position_name: position,
   
      });

      console.log('Position created successfully:', response.data);
      Swal.fire({
        title: 'Position Created!',
        text: 'Position created successfully',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        onClose();
        window.location.reload();
      });
    } catch (err) {
      console.error('Error creating position:', err);
      setError('Failed to create position. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[400px] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-700">Add Position</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            ✖
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="position"
              className="text-sm font-medium text-gray-700"
            >
              Postion
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="border rounded-lg p-2 mt-1 focus:outline-blue-700 w-full"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-lg ${
                isLoading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPositionModal;
