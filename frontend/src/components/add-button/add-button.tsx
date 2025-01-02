import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  height?: string;
  width?: string;
}

const AddButton: React.FC<ButtonProps> = ({
  onClick,
  children,
  height,
  width,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-yellow-400 text-black rounded-full hover:bg-yellow-500 font-bold border-2 border-blue-900"
      style={{
        height: height || 'auto',
        width: width || 'auto',
        padding: '0.5rem 1rem',
      }}
    >
      {children}
    </button>
  );
};

export default AddButton;
