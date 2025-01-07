import React, { useState } from 'react';

interface ImageViewerProps {
  src: string;
  alt?: string;
  className?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  alt = 'Image',
  className,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      {/* Thumbnail or Main Image */}
      <img
        src={src}
        alt={alt}
        className={className || 'cursor-pointer'}
        onClick={openModal}
      />

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex  items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div className="relative flex justify-center items-center  bg-white  p-5">
            {/* Centered Small Image */}
            <img
              src={src}
              alt={alt}
              className="w-3/5 h-auto max-w-2xl max-h-96 rounded shadow-lg"
              onClick={(e) => e.stopPropagation()} // Prevent closing modal on image click
            />
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 p-1  "
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
