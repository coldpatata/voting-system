import  { useState } from 'react';

const Dropdown = () => {
  const [positions, setPositions] = useState([
    { id: '1', name: 'President' },
    { id: '2', name: 'Vice President' },
    { id: '3', name: 'Secretary' },
  ]); 

  const [selectedPosition, setSelectedPosition] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCandidates, setShowCandidates] = useState(true); 


  const candidatesData = {
    '1': [
      { id: '101', name: 'Emma Carter', image: '/images/emma.png' },
      { id: '102', name: 'Ava Mitchell', image: '/images/ava.png' },
      { id: '103', name: 'John Smith', image: '/images/john.png' },
      { id: '104', name: 'Sophia Brown', image: '/images/sophia.png' },
    ],
    '2': [
      { id: '201', name: 'Liam Johnson', image: '/images/liam.png' },
      { id: '202', name: 'Olivia Davis', image: '/images/olivia.png' },
    ],
    '3': [{ id: '301', name: 'William Moore', image: '/images/william.png' }],
  };

  // Fetch candidates when a position is selected
  const handlePositionChange = (positionId) => {
    setSelectedPosition(positionId);
    if (positionId) {
      setIsLoading(true);

      // Simulated delay to mimic backend fetching
      setTimeout(() => {
        setCandidates(candidatesData[positionId] || []);
        setIsLoading(false);
        setShowCandidates(true);
      }, 500);
    } else {
      setCandidates([]);
    }
  };



  return (
    <div className=" p-6 font-sans rounded-lg">
      {/* Position Dropdown */}
      <label className="block mb-2 text-xl font-medium text-black">
        Position
      </label>
      <select
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={selectedPosition}
        onChange={(e) => handlePositionChange(e.target.value)}
      >
        <option value="">Select a position</option>
        {positions.map((position) => (
          <option key={position.id} value={position.id}>
            {position.name}
          </option>
        ))}
      </select>

 
      {isLoading ? (
        <p className="mt-4 text-center text-gray-500">Loading candidates...</p>
      ) : showCandidates && candidates.length > 0 ? (
        <div className="mt-6">
          <div className="flex  items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Candidates</h2>
          </div>
          <div className="max-h-48 overflow-y-scroll space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex items-center bg-gray-100 p-4 rounded-md shadow-sm"
              >
                <img
                  src={candidate.image || '/default-avatar.png'} // Replace with default image
                  alt={candidate.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <span className="flex-1 text-gray-700 font-medium">
                  {candidate.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : selectedPosition && !isLoading && showCandidates ? (
        <p className="mt-4 text-gray-500 text-center">
          No candidates available for this position.
        </p>
      ) : null}
    </div>
  );
};

export default Dropdown;
