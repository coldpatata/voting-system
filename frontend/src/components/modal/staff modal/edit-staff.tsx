import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface EditStaffProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditStaff: React.FC<EditStaffProps> = ({ userId, isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [suffix, setSuffix] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userId) {
      const fetchStaffData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/users/${userId}`
          );
          const staff = response.data;
          setUsername(staff.username);
          setFirstName(staff.first_name);
          setLastName(staff.last_name);
          setMiddleInitial(staff.middle_initial);
          setGender(staff.gender);
          setEmail(staff.email);
          setContactNumber(staff.contact_number);
          setSuffix(staff.suffix);
        } catch (err) {
          console.error('Error fetching student data:', err);
        }
      };

      fetchStaffData();
    }
  }, [userId]);

  const handleSubmit = async () => {
    try {
      const updatedStaff = {
        username,
        first_name: firstName,
        last_name: lastName,
        middle_initial: middleInitial,
        gender,
        email,
        contact_number: contactNumber,
        suffix,
      };

      await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        updatedStaff
      );

      Swal.fire({
        title: 'Staff Updated',
        text: 'The staff data has been successfully updated.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        window.location.reload();
      });

      onClose();
      setIsEditing(false);
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'There was an error updating the student data.',
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
          {isEditing ? 'Edit Staff Account' : 'View Staff Account'}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: 'Username',
              value: username,
              setValue: setUsername,
              editable: false,
            },
            {
              label: 'First Name',
              value: firstName,
              setValue: setFirstName,
              editable: false,
            },
            {
              label: 'Last Name',
              value: lastName,
              setValue: setLastName,
              editable: false,
            },
            {
              label: 'Middle Initial',
              value: middleInitial,
              setValue: setMiddleInitial,
              editable: false,
            },

            {
              label: 'Gender',
              value: gender,
              setValue: setGender,
              editable: false,
            },
            {
              label: 'Email',
              value: email,
              setValue: setEmail,
              editable: false,
            },
            {
              label: 'Contact Number',
              value: contactNumber,
              setValue: setContactNumber,
              editable: false,
            },
            {
              label: 'Suffix',
              value: suffix,
              setValue: setSuffix,
              editable: false,
            },
          ].map(({ label, value, setValue, editable }) => (
            <div key={label}>
              <label className="block text-sm font-medium">{label}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!isEditing && !editable}
                className={`w-full border rounded p-2 mt-1 ${
                  editable ? 'bg-white' : 'bg-gray-100'
                }`}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => (isEditing ? handleSubmit() : setIsEditing(true))}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isEditing ? 'Save' : 'Edit'}
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

export default EditStaff;
