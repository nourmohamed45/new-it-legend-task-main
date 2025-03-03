import { useRef, useEffect } from "react";
import { ArrowRight, X } from "lucide-react";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedQuestion: string;
  onQuestionChange: (question: string) => void;
  onSubmit: () => void;
}

const QuestionModal = ({
  isOpen,
  onClose,
  savedQuestion,
  onQuestionChange,
  onSubmit,
}: QuestionModalProps) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the textarea when the modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // Handle click outside to close modal
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="question-modal-title"
    >
      <div
        ref={modalContentRef}
        className="bg-white rounded-lg w-full max-w-md overflow-hidden flex flex-col shadow-xl"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 id="question-modal-title" className="text-xl font-medium">
            Ask a Question
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <textarea
            ref={textareaRef}
            className="w-full p-4 shadow-md rounded-md resize-none border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            placeholder="Type your question here..."
            rows={5}
            value={savedQuestion}
            onChange={(e) => onQuestionChange(e.target.value)}
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={onSubmit}
              className="bg-[#41b69d] text-white px-4 py-2 rounded-md hover:bg-[#389e88] transition-colors flex items-center"
            >
              Submit Question <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
