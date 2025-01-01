import { FC } from 'react';

interface EditStudentProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditStudent: FC<EditStudentProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <>
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
                  className="p-2 border rounded text-black"
                />
              ))}
              <select name="suffix" className="p-2 border rounded text-black">
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
                className="p-2 border rounded text-black"
              >
                <option value="" disabled>
                  Year Level
                </option>
                {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(
                  (year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                )}
              </select>
              <select name="gender" className="p-2 border rounded text-black">
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
          {/* {!file ? (
            <div className="flex items-center justify-center p-6">
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-blue-800 text-white rounded cursor-pointer"
              >
                Import File
              </label>
              <input id="file-upload" type="file" className="hidden" />
            </div>
          ) : (
            <div className="flex flex-col-reverse justify-center items-center w-full">
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-yellow-500 text-black rounded">
                  Submit
                </button>
                <button className="px-4 py-2 bg-gray-300 text-black rounded">
                  Cancel
                </button>
              </div>

              <div className="text-green-500 p-2">
                File selected: {file.name}
              </div>
            </div>
          )} */}

          <div className="mt-4 flex justify-end">
            <div className="flex gap-5">
              <button
                onClick={() => {
                  onClose();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditStudent;
