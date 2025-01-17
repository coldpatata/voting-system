import React from 'react';

interface QRViewerProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode: string;
  ballotName: string;
}

const QRViewer: React.FC<QRViewerProps> = ({ isOpen, onClose, qrCode, ballotName }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `${ballotName.replace(/\s+/g, '-')}-qr.png`;
    link.href = qrCode;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Ballot QR Code</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        <div className="text-center">
          <p className="mb-4 text-lg font-semibold">{ballotName}</p>
          {qrCode && (
            <div className="mb-4">
              <img 
                src={qrCode} 
                alt="Ballot QR Code" 
                className="mx-auto w-64 h-64"
              />
              <p className="text-sm text-gray-500 mt-2">Scan this QR code to access the ballot</p>
            </div>
          )}
          <div className="space-x-3">
            <button
              onClick={handleDownload}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Download QR Code
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRViewer;
