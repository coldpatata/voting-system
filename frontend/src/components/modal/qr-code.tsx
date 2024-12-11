import React from 'react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeImage: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  qrCodeImage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="bg-blue-800 text-white text-center py-2">
          <h1 className="text-lg font-bold text-left pl-2">Student QR</h1>
        </div>
        <img src={qrCodeImage} alt="QR Code" className="w-full h-auto" />
        <button
          onClick={() => window.open(qrCodeImage, '_blank')}
          className="mt-4 w-full bg-yellow-400 text-black rounded hover:bg-yellow-500 py-2"
        >
          Download QR
        </button>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;
