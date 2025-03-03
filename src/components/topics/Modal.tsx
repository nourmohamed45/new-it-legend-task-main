import { useRef } from "react";
import { ModalProps } from "./types";
import ExamInterface from "./ExamInterface";

const Modal = ({
  isOpen,
  onClose,
  title,
  contentType,
  contentSource,
  examId,
  onExamComplete,
}: ModalProps) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close modal
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking the backdrop (not the content)
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      {/* Different styling for PDF vs Exam */}
      {contentType === "pdf" ? (
        <div
          ref={modalContentRef}
          className="fixed inset-0 bg-white flex flex-col w-full h-full"
        >
          <div className="p-4 border-b flex justify-between items-center bg-white shadow-md">
            <h3 className="text-xl font-medium">{title}</h3>
            <button
              title="Close"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            {contentSource && (
              <iframe
                src={contentSource}
                className="w-full h-full"
                title={title}
              />
            )}
          </div>
        </div>
      ) : (
        <div
          ref={modalContentRef}
          className="bg-white rounded-lg w-full max-w-md h-[90vh] overflow-hidden flex flex-col shadow-xl"
        >
          <ExamInterface
            examId={examId}
            onClose={onClose}
            onExamComplete={onExamComplete}
          />
        </div>
      )}
    </div>
  );
};

export default Modal;
