import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  position: {
    position_id: number;
    position_name: string;
  };
}

const EditPositionModal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  position,
}) => {
  const [formData, setFormData] = useState({
    positionName: position.position_name,
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

    const { positionName } = formData;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/position/updatePosition/${position.position_id}`,
        {
          position_name: positionName,
        }
      );

      console.log('Position updated successfully:', response.data);
      Swal.fire({
        title: 'Position Updated!',
        text: 'Position updated successfully',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        onClose();
        window.location.reload();
      });
    } catch (err) {
      console.error('Error updating position:', err);
      setError('Failed to update position. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[800px] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-700">{title}</h2>
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
              htmlFor="positionName"
              className="text-sm font-medium text-gray-700"
            >
              Position Name
            </label>
            <input
              type="text"
              id="positionName"
              name="positionName"
              value={formData.positionName}
              onChange={handleChange}
              className="border rounded-lg p-2 mt-1 focus:outline-blue-700 w-full"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
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

export default EditPositionModal;
