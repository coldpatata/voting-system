import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

const AddCandidatesModal: React.FC<ModalProps> = ({ isOpen, title, onClose }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    position: '',
    middleInitial: '',
    suffix: '',
    candidateNumber: '',
    photo: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    const files = (e.target as HTMLInputElement).files;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[30%] p-6">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstname"
                className="text-sm font-medium text-gray-700"
              >
                Firstname
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                className="border rounded-lg p-2 mt-1 focus:outline-blue-700 w-full"
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="lastname"
                className="text-sm font-medium text-gray-700"
              >
                Lastname
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                className="border rounded-lg p-2 mt-1 focus:outline-blue-700 w-full"
                onChange={handleChange}
              />
            </div>
          </div>
          <select
            name="Position"
            value=""
            onChange={handleChange}
            className="p-2 w-full border rounded text-black"
          >
            <option value="" disabled>
              Position
            </option>
            {['Provide', 'A', 'Position'].map((suffix) => (
              <option key={suffix} value={suffix}>
                {suffix}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="middleInitial"
                className="text-sm font-medium text-gray-700"
              >
                Middle Initial
              </label>
              <input
                type="text"
                id="middleInitial"
                name="middleInitial"
                className="border rounded-lg p-2 mt-1 focus:outline-blue-700 w-full"
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="suffix"
                className="text-sm font-medium text-gray-700"
              >
                Suffix (Optional)
              </label>
              <input
                type="text"
                id="suffix"
                name="suffix"
                className="border rounded-lg p-2 mt-1 focus:outline-blue-700 w-full"
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="candidateNumber"
              className="text-sm font-medium text-gray-700"
            >
              Candidate Number
            </label>
            <input
              type="text"
              id="candidateNumber"
              name="candidateNumber"
              className="border rounded-lg p-2 mt-1 focus:outline-blue-700 w-full"
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="photo"
              className="text-sm font-medium text-gray-700"
            >
              Photo Attachment
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              className="border rounded-lg p-2 mt-1 focus:outline-blue-700 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-white hover:file:bg-yellow-600"
              onChange={handleChange}
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
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidatesModal;
