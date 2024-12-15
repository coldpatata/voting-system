import React from 'react';
import axios from 'axios';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeImage: string; // This will be used for displaying the QR code
  qrData: {
    name: string;
    openingDate: string;
    closingDate: string;
    eligibility: string;
  }; // This contains the data to generate the QR code on the backend
  
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  qrCodeImage,
  qrData, // Data to be sent to the backend
}) => {
  if (!isOpen) return null;

  // Function to download the QR code image using the backend API
  const handleDownloadQR = async () => {
    try {
      // Send a GET request to your backend API to generate and download the QR code
      const response = await axios.get(
        `http://localhost:5000/api/qr/download-qr`,
        {
          params: qrData, // Send the necessary data (e.g., name, openingDate, closingDate)
          responseType: 'blob', // We expect the response as binary data (image)
        }
      );

      // Create a Blob from the response data (which is the QR code image)
      const blob = response.data;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob); // Create a URL for the image Blob
      link.download = 'student_qr.png'; // Set the filename for the downloaded QR code
      link.click(); // Trigger the download
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="bg-blue-800 text-white text-center py-2">
          <h1 className="text-lg font-bold text-left pl-2">Student QR</h1>
        </div>
        <img src={qrCodeImage} alt="QR Code" className="w-full h-auto" />
        <button
          onClick={handleDownloadQR} // Call the new handleDownloadQR function
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
