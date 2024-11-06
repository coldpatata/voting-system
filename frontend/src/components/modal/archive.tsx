import React from 'react';

type ArchiveModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ArchiveModal: React.FC<ArchiveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-10">
      <div className="bg-white rounded-lg p-6 w-80">
        <div className="text-center">
          <div className="`text-orange-500 text-4xl mb-4">!</div>
          <h2 className="text-xl font-semibold">Are you sure?</h2>
          <p className="text-gray-500 mb-6">
            You won’t be able to revert this!
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveModal;
