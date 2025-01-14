import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../../components/header/header';
import AddCandidatesModal from '../../../components/modal/candidate modal/add-candidates';
import EditCandidatesModal from '../../../components/modal/candidate modal/edit-candidate';

type Candidate = {
  id: number;
  firstname: string;
  lastname: string;
  position: string;
  middle_initial: string;
  suffix: string;
  candidate_number: number;
  photo_url: string;
};

const CandidatePage: FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isAddCandidatesModalOpen, setIsAddCandidatesModalOpen] = useState(false);
  const [isEditCandidatesModalOpen, setIsEditCandidatesModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const handleOpenAddCandidatesModal = () => setIsAddCandidatesModalOpen(true);
  const handleCloseAddCandidatesModal = () => setIsAddCandidatesModalOpen(false);
  const handleOpenEditCandidatesModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsEditCandidatesModalOpen(true);
  };
  const handleCloseEditCandidatesModal = () => setIsEditCandidatesModalOpen(false);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/candidate/getAllCandidates')
      .then((response) => {
        setCandidates(response.data.data); 
      })
      .catch((error) => {
        console.error('Error fetching candidates:', error);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-200 p-8">
        <div className="bg-blue-900 text-white p-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl font-bold mb-2 md:mb-0">Candidates</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenAddCandidatesModal}
              className="bg-yellow-400 text-black px-4 py-2 rounded"
            >
              Add
            </button>
            <div className="flex">
              <input
                type="text"
                className="px-2 py-1 rounded-tl-lg rounded-bl-lg text-black"
              />
              <button className="bg-yellow-400 w-1/4 p-2">Search</button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-gray-300">
                <th className="py-2 px-4 border">Candidate #</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Photo</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="text-center">
                  <td className="py-2 px-4 border">{candidate.candidate_number}</td>
                  <td className="py-2 px-4 border">
                    {candidate.firstname} {candidate.middle_initial}. {candidate.lastname} {candidate.suffix}
                  </td>
                  <td className="py-2 px-4 border">
                    <img
                      src={candidate.photo_url}
                      alt={`${candidate.firstname} ${candidate.lastname}`}
                      className="mx-auto h-12 w-12 object-cover"
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleOpenEditCandidatesModal(candidate)}
                      className="bg-yellow-400 text-black px-4 py-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded">
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center space-x-2 py-4">
          <button className="text-gray-600">&laquo; Previous</button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded ${page === 2 ? 'bg-blue-900 text-white' : 'text-gray-600'
                }`}
            >
              {page}
            </button>
          ))}
          <button className="text-gray-600">Next &raquo;</button>
        </div>
      </div>
      <AddCandidatesModal
        isOpen={isAddCandidatesModalOpen}
        title="Add New Candidate"
        onClose={handleCloseAddCandidatesModal}
      />
      {selectedCandidate && (
        <EditCandidatesModal
          isOpen={isEditCandidatesModalOpen}
          title="Edit Candidate"
          onClose={handleCloseEditCandidatesModal}
          candidate={selectedCandidate}
        />
      )}
    </>
  );
};

export default CandidatePage;
