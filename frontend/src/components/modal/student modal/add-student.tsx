import { FC, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (studentData: Record<string, string>) => void;
}

const AddStudentModal: FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    middle_initial: '',
    suffix: '',
    year_level: '',
    contact_number: '',
    email: '',
    gender: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');

  const resetForm = () => {
    setFormData({
      username: '',
      first_name: '',
      last_name: '',
      middle_initial: '',
      suffix: '',
      year_level: '',
      contact_number: '',
      email: '',
      gender: '',
    });
    setFile(null);
    setUploadError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadError('');
    }
  };

  const handleImport = async () => {
    if (!file) {
      setUploadError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(
        'http://localhost:5000/api/users/importStudents',
        formData
      );
      Swal.fire({
        title: 'Success!',
        text: 'Students have been successfully imported!',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        resetForm();
        onClose();
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to upload the file. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (Object.values(formData).some((value) => !value)) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill out all required fields.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/addStudent',
        formData
      );

      if (response.status === 201) {
        Swal.fire({
          title: 'Success!',
          text: 'Student has been successfully added!',
          icon: 'success',
          timer: 1200,
          confirmButtonText: 'OK',
        }).then(() => {
          onSubmit(formData);
          resetForm();
          onClose();
          window.location.reload();
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to add student. Please try again.';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  if (!isOpen) return null;

  const isFormFilled = Object.values(formData).every((value) => value);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <div className="bg-blue-800 text-white text-xl font-semibold p-2 rounded-t">
          Add Student Account
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'username', placeholder: 'Username' },
              { name: 'first_name', placeholder: 'First Name' },
              { name: 'last_name', placeholder: 'Last Name' },
              { name: 'middle_initial', placeholder: 'M. Initial' },
              { name: 'contact_number', placeholder: 'Contact Number' },
              { name: 'email', placeholder: 'Email (Optional)' },
            ].map(({ name, placeholder }) => (
              <input
                key={name}
                type="text"
                name={name}
                placeholder={placeholder}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                className="p-2 border rounded text-black"
              />
            ))}
            <select
              name="suffix"
              value={formData.suffix}
              onChange={handleChange}
              className="p-2 border rounded text-black"
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
            <select
              name="year_level"
              value={formData.year_level}
              onChange={handleChange}
              className="p-2 border rounded text-black"
            >
              <option value="" disabled>
                Year Level
              </option>
              {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-2 border rounded text-black"
            >
              <option value="" disabled>
                Gender
              </option>
              {['Male', 'Female'].map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>
        </div>
        {!file ? (
          <div className="flex items-center justify-center p-6">
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-blue-800 text-white rounded cursor-pointer"
            >
              Import File
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex flex-col-reverse justify-center items-center w-full">
            <div className="flex gap-4">
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-yellow-500 text-black rounded"
              >
                Submit
              </button>
              <button
                onClick={() => setFile(null)}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Cancel
              </button>
            </div>

            <div className="text-green-500 p-2">File selected: {file.name}</div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <div className="flex gap-5">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
            {isFormFilled && (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Submit
              </button>
            )}
          </div>
        </div>

        {uploadError && (
          <div className="text-red-500 text-sm mt-2">{uploadError}</div>
        )}
      </div>
    </div>
  );
};

export default AddStudentModal;
