import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface EditStudentProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditStudent: React.FC<EditStudentProps> = ({
  userId,
  isOpen,
  onClose,
}) => {
  const [username, setUsername] = useState('');
  const [student, setStudent] = useState<any>({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [suffix, setSuffix] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userId) {
      const fetchStudentData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/users/${userId}`
          );
          setStudent(response.data);
          setUsername(response.data.username);
          setFirstName(response.data.first_name);
          setLastName(response.data.last_name);
          setMiddleInitial(response.data.middle_initial);
          setYearLevel(response.data.year_level);
          setGender(response.data.gender);
          setEmail(response.data.email);
          setSuffix(response.data.suffix);
          setContactNumber(response.data.contact_number);
        } catch (err) {
          console.error('Error fetching student data:', err);
        }
      };

      fetchStudentData();
    }
  }, [userId]);

  const handleSubmit = async () => {
    try {
      const updatedStudent = {
        ...student,
        username: username,
        first_name: firstName,
        last_name: lastName,
        middle_initial: middleInitial,
        year_level: yearLevel,
        gender: gender,
      };

      await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        updatedStudent
      );

      Swal.fire({
        title: 'Student Updated',
        text: 'The student data has been successfully updated.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        window.location.reload();
      });

      onClose();
      setIsEditing(false);
    } catch {
      Swal.fire({
        title: 'Error',
        text: 'There was an error updating the student data.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg gap-4">
          <div className="mt-4 w-full">
            <div className="bg-blue-800 w-full text-white text-xl font-semibold p-2 rounded-t mb-2">
              Edit Student Account
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  name: 'username',
                  placeholder: 'Username',
                  value: username,
                  editable: isEditing,
                },
                {
                  name: 'first_name',
                  placeholder: 'First Name',
                  value: firstName,
                  editable: false,
                },
                {
                  name: 'last_name',
                  placeholder: 'Last Name',
                  value: lastName,
                  editable: false,
                },
                {
                  name: 'middle_initial',
                  placeholder: 'Middle Initial',
                  value: middleInitial,
                  editable: false,
                },
                {
                  name: 'contact_number',
                  placeholder: 'Contact Number',
                  value: contactNumber,
                  editable: false,
                },
                {
                  name: 'email',
                  placeholder: 'Email (Optional)',
                  value: email,
                  editable: false,
                },
              ].map(({ name, placeholder, value, editable }) => (
                <div key={name}>
                  <label className="block text-sm">{placeholder}</label>
                  <input
                    type="text"
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                      if (name === 'username') setUsername(e.target.value);
                      if (name === 'first_name') setFirstName(e.target.value);
                      if (name === 'last_name') setLastName(e.target.value);
                      if (name === 'middle_initial')
                        setMiddleInitial(e.target.value);
                      if (name === 'contact_number')
                        setContactNumber(e.target.value);
                      if (name === 'email') setEmail(e.target.value); 
                    }}
                    readOnly={!editable}
                    className={`w-full p-2 mt-2 border text-black ${
                      editable ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                    }`}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm">Suffix</label>
                <input
                  type="text"
                  name="suffix"
                  value={suffix}
                  readOnly
                  className="w-full p-2 mt-2 border text-black bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm">Year Level</label>
                <input
                  type="text"
                  name="year_level"
                  value={yearLevel}
                  readOnly
                  className="w-full p-2 mt-2 border text-black bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm">Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={gender}
                  readOnly
                  className="w-full p-2 mt-2 border text-black bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 w-full flex justify-end gap-4">
            <button
              onClick={() => {
                if (isEditing) {
                  handleSubmit();
                } else {
                  setIsEditing(true); // Enable editing
                }
              }}
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
    )
  );
};

export default EditStudent;
