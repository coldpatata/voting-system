import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  candidate: {
    id: number;
    firstname: string;
    lastname: string;
    position: string;
    middle_initial: string;
    suffix: string;
    candidate_number: number;
    photo_url: string;
  };
}

const EditCandidatesModal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  candidate,
}) => {
  const [formData, setFormData] = useState({
    firstname: candidate.firstname,
    lastname: candidate.lastname,
    position: candidate.position,
    middleInitial: candidate.middle_initial,
    suffix: candidate.suffix,
    candidateNumber: candidate.candidate_number,
    photo: null,
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [positions, setPositions] = useState<
    { position_id: number; position_name: string }[]
  >([]);

  useEffect(() => {
    // Fetch positions from the API
    const fetchPositions = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/position/getAllPositions'
        );
        const positionsData = response.data.data;
        setPositions(positionsData);

        if (positionsData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            position: positionsData[0].position_name,
          }));
        }
      } catch (err) {
        console.error('Error fetching positions:', err);
      }
    };

    fetchPositions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    const files = (e.target as HTMLInputElement).files;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      firstname,
      lastname,
      position,
      middleInitial,
      suffix,
      candidateNumber,
      photo,
    } = formData;

    let photoUrl = candidate.photo_url;

    if (photo) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', photo);

        const uploadResponse = await axios.post(
          'http://localhost:5000/api/upload/uploadSingle',
          uploadFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (uploadResponse.status === 200) {
          const fileUrl = uploadResponse.data.fileUrl;
          photoUrl = `https://qdqcdyopziokllxehnuq.supabase.co/storage/v1/object/public/uploads/${fileUrl}`;
          console.log('Image uploaded successfully:', photoUrl);
        } else {
          throw new Error('File upload failed');
        }
      } catch (uploadError) {
        console.error('Error during file upload:', uploadError);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Image upload failed. Proceeding without an image.',
        });
      }
    }

    try {
      const candidateData = {
        firstname,
        lastname,
        position,
        middle_initial: middleInitial,
        suffix,
        candidate_number: candidateNumber,
        photo_url: photoUrl, // Use the uploaded photo URL
      };

      const response = await axios.put(
        `http://localhost:5000/api/candidate/updateCandidate/${candidate.id}`,
        candidateData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response:', response.data);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Candidate updated successfully!',
      }).then(() => {
        onClose();
        window.location.reload();
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(
        'An error occurred while updating the candidate. Please try again.'
      );
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update the candidate. Please try again.',
      });
    } finally {
      setLoading(false);
    }
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
                value={formData.firstname}
                className="border rounded-lg p-2 mt-1 focus:outline-blue-700 w-full"
                onChange={handleChange}
                required
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
                value={formData.lastname}
                className="border rounded-lg p-2 mt-1 focus:outline-blue-700 w-full"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="p-2 w-full border rounded text-black"
            required
          >
            <option value="" disabled>
              Select Position
            </option>
            {positions.map((position) => (
              <option key={position.position_id} value={position.position_name}>
                {position.position_name}
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
                value={formData.middleInitial}
                className="border rounded-lg p-2 mt-1 focus:outline-blue-700 w-full"
                onChange={handleChange}
              />
            </div>
            <div className="flex items-end">
              <select
                name="suffix"
                value={formData.suffix}
                onChange={handleChange}
                className="p-2 border rounded text-black w-full flex "
              >
                <option value="" disabled>
                  Suffix
                </option>
                {['N/A', 'Jr.', 'Sr.'].map((suffix) => (
                  <option key={suffix} value={suffix}>
                    {suffix}
                  </option>
                ))}
              </select>
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
              value={formData.candidateNumber}
              className="border rounded-lg p-2 mt-1 focus:outline-blue-700 w-full"
              onChange={handleChange}
              required
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
          {error && <p className="text-red-500">{error}</p>}
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
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCandidatesModal;
