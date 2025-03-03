import React from "react";

interface ErrorModalProps {
  error: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ error, onClose }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white text-gray-800 p-4 md:p-5 rounded-lg max-w-[90%] md:max-w-md text-center shadow-xl">
        <div className="text-red-500 mb-2 md:mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 md:h-10 md:w-10 mx-auto"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="font-medium text-base md:text-lg mb-2">Error</p>
        <p className="text-sm md:text-base mb-3 md:mb-4">{error}</p>
        <button
          className="bg-red-500 text-white px-4 py-1 md:px-5 md:py-2 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm md:text-base"
          onClick={onClose}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
