import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewBallot: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const positions = ['President', 'V-President', 'Secretary', 'Treasurer'];
  const candidates = ['Emma Carter', 'Ava Mitchell'];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-blue-800 text-white text-lg font-bold p-4 rounded-t-lg">
          View Ballot
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Ballot Name
            </label>
            <input
              type="text"
              value="2024 SSLG Election"
              className="w-full p-2 border border-gray-300 rounded bg-gray-200"
              readOnly
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positions.map((position, index) => (
              <div key={index} className="border border-gray-300 rounded p-4">
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={position}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-200"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Candidates
                  </label>
                  <div className="space-y-2">
                    {candidates.map((candidate, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <img
                          src={`https://placehold.co/50x50?text=${
                            candidate.split(' ')[0][0]
                          }`}
                          alt={`Image of ${candidate}`}
                          className="w-12 h-12 rounded-full"
                        />
                        <input
                          type="text"
                          value={candidate}
                          className="flex-1 p-2 border border-gray-300 rounded bg-gray-200"
                          readOnly
                        />
                        <input
                          type="radio"
                          name={`position-${index}`}
                          className="form-radio h-5 w-5 text-gray-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={onClose}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded">
              View QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBallot;
