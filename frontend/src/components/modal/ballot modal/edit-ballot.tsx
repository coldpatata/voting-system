import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface EditBallotModalProps {
  isOpen: boolean;
  onClose: () => void;
  ballotId: number;
  currentBallotName: string;
  currentOpeningDate: string;
  currentClosingDate: string;
  onUpdate: () => void;
}

const EditBallotModal: React.FC<EditBallotModalProps> = ({
  isOpen,
  onClose,
  ballotId,
  currentBallotName,
  currentOpeningDate,
  currentClosingDate,
  onUpdate
}) => {
  const [ballotName, setBallotName] = useState('');
  const [openingDate, setOpeningDate] = useState('');
  const [closingDate, setClosingDate] = useState('');

  useEffect(() => {
    setBallotName(currentBallotName);
    setOpeningDate(currentOpeningDate.slice(0, 16));
    setClosingDate(currentClosingDate.slice(0, 16));
  }, [currentBallotName, currentOpeningDate, currentClosingDate]);

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/ballot/updateBallot/${ballotId}`, {
        ballot_name: ballotName,
        opening_date: openingDate,
        closing_date: closingDate
      });
      
      Swal.fire({
        title: 'Success!',
        text: 'Ballot updated successfully',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        window.location.reload();
        onUpdate();
        onClose();
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update ballot',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <div className="bg-blue-800 text-white text-xl font-semibold p-3 rounded-t mb-4">
          Edit Ballot
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[
            {
              label: 'Ballot Name',
              value: ballotName,
              setValue: setBallotName,
              type: 'text'
            },
            {
              label: 'Opening Date',
              value: openingDate,
              setValue: setOpeningDate,
              type: 'datetime-local'
            },
            {
              label: 'Closing Date',
              value: closingDate,
              setValue: setClosingDate,
              type: 'datetime-local'
            },
          ].map(({ label, value, setValue, type }) => (
            <div key={label}>
              <label className="block text-sm font-medium">{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border rounded p-2 mt-1 bg-white"
                required
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBallotModal;
