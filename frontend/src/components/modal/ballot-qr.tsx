import React from 'react';

interface BallotQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode: string;
  ballotName: string;
}

const BallotQRModal: React.FC<BallotQRModalProps> = ({
  isOpen,
  onClose,
  qrCode,
  ballotName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Ballot QR Code</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="text-center">
          <p className="mb-4">{ballotName}</p>
          <img src={qrCode} alt="Ballot QR Code" className="mx-auto mb-4" />
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.download = `${ballotName}-qr.png`;
              link.href = qrCode;
              link.click();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default BallotQRModal;
