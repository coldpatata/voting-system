import { useState, useEffect } from 'react';
import ImageViewer from '../modal/imageviewer';

interface Position {
  id: number;
  name: string;
}

export interface Candidate {
  id: string;
  firstname: string;
  lastname: string;
  middle_initial: string;
  position: string;
  photo_url: string;
}

// Declare the variable outside the component to persist data
let ballotCandidates: Candidate[] = []; // Explicitly typed as an array of Candidate
let selectedPositions: string[] = []; // Array to store all selected positions
interface DropdownProps {
  onBallotCandidatesUpdate: (candidates: Candidate[]) => void;
}

const Dropdown = ({ onBallotCandidatesUpdate }: DropdownProps) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCandidates, setShowCandidates] = useState<boolean>(true);
  // Fetch positions from API when the component mounts
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/position/getAllPositions'
        );
        const data = await response.json();
        if (response.ok) {
          setPositions(
            data.data.map((position: any) => ({
              id: position.position_id,
              name: position.position_name,
            }))
          );
        } else {
          console.error('Failed to fetch positions:', data.message);
        }
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };

    fetchPositions();
  }, []);

  // Fetch candidates when a position is selected
  const handlePositionChange = async (position: string) => {
    if (selectedPositions.includes(position)) {
      alert('Position is already selected');
      return; // Exit if the position is already in the array
    }

    // Add the new position to the array
    selectedPositions.push(position);

    setSelectedPosition(position);

    if (position) {
      setIsLoading(true);

      try {
        const response = await fetch(
          `http://localhost:5000/api/candidate/getCandidatesByPosition?position=${position}`
        );
        const data = await response.json();
        if (response.ok) {
          setCandidates((prevCandidates) => [
            ...prevCandidates,
            ...(data.data || []),
          ]);

          // Append to non-state array
          if (data.data && Array.isArray(data.data)) {
            ballotCandidates = [...ballotCandidates, ...data.data];
            onBallotCandidatesUpdate(ballotCandidates);
          }
        } else {
          console.error('Failed to fetch candidates:', data.message);
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setIsLoading(false);
        setShowCandidates(true);
      }
    } else {
      setCandidates([]);
      ballotCandidates = [];
      onBallotCandidatesUpdate(ballotCandidates);
    }
  };

  return (
    <div className="p-6 font-sans rounded-lg">
      {/* Position Dropdown */}
      <label className="block mb-2 text-xl font-medium text-black">
        Position
      </label>
      <select
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onChange={(e) => {
          const selected = positions.find(
            (pos) => pos.id === Number(e.target.value)
          );
          if (selected) {
            handlePositionChange(selected.name);
          }
        }}
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Candidates</h2>
          </div>
          <div className="max-h-48 overflow-y-scroll space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex items-center bg-gray-100 p-4 rounded-md shadow-sm"
              >
                {/* Use ImageViewer for the candidate photo */}
                <ImageViewer
                  src={candidate.photo_url || '/default-avatar.png'}
                  alt={`${candidate.firstname} ${candidate.lastname}`}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <span className="flex-1 text-gray-700 font-medium">
                  {candidate.firstname +
                    ' ' +
                    candidate.middle_initial +
                    ' ' +
                    candidate.lastname}
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
