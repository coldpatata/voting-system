import { FC, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

interface AddStaffProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (staffData: Record<string, string>) => void;
}

const AddStaff: FC<AddStaffProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    middle_initial: '',
    suffix: '',
    contact_number: '',
    email: '',
  });

  const resetForm = () => {
    setFormData({
      username: '',
      first_name: '',
      last_name: '',
      middle_initial: '',
      suffix: '',
      contact_number: '',
      email: '',
    });
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
        'http://localhost:5000/api/users/addStaff',
        formData
      );

      if (response.status === 201) {
        Swal.fire({
          title: 'Success!',
          text: 'Staff has been successfully added!',
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
        'Failed to add staff. Please try again.';
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
          Add Staff Account
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'username', placeholder: 'Username' },
              { name: 'first_name', placeholder: 'First Name' },
              { name: 'last_name', placeholder: 'Last Name' },
              { name: 'middle_initial', placeholder: 'M. Initial' },
              { name: 'suffix', placeholder: 'Suffix (Optional)' },
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
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default AddStaff;
