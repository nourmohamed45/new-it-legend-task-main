import { BookOpen, HelpCircle, MessageSquare, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import QuestionModal from "./QuestionModal";
import LeaderboardModal from "./LeaderboardModal";

interface ReferenceSectionProps {
  onAddQuestion?: (question: string) => void;
  studentProgress?: number;
  courseName?: string;
}

const ReferenceSection = ({
  onAddQuestion,
  studentProgress = 85,
  courseName,
}: ReferenceSectionProps) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");

  // Check if we're on desktop when component mounts and when window resizes
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Initial check
    checkIfDesktop();

    // Add resize listener
    window.addEventListener("resize", checkIfDesktop);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfDesktop);
    };
  }, []);

  const handleScroll = (path: string) => {
    // Extract the ID without the hash
    const id = path.substring(1);

    // Find the target element
    const targetElement = document.getElementById(id);

    if (!targetElement) {
      console.error(`Element with id "${id}" not found`);
      return;
    }

    if (isDesktop) {
      // On desktop, we need special handling
      if (id === "curriculum") {
        // Find the closest parent that contains the curriculum
        // This works for both normal and wide mode
        const curriculumContainer = targetElement.closest(".col-span-1");
        if (curriculumContainer) {
          curriculumContainer.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          // Fallback to the element itself
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } else if (id === "comments") {
        // For comments, scroll to the element directly
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      // On mobile, we can scroll directly to the element
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Update URL without causing a page jump
    if (history.pushState) {
      history.pushState(null, "", path);
    }
  };

  const openQuestionModal = () => {
    setIsQuestionModalOpen(true);
  };

  const closeQuestionModal = () => {
    setIsQuestionModalOpen(false);
  };

  const openLeaderboardModal = () => {
    setIsLeaderboardModalOpen(true);
  };

  const closeLeaderboardModal = () => {
    setIsLeaderboardModalOpen(false);
  };

  const handleQuestionChange = (question: string) => {
    setQuestionText(question);
  };

  const handleSubmitQuestion = () => {
    if (questionText.trim() && onAddQuestion) {
      // Call the callback to add the question as a comment
      onAddQuestion(questionText);

      // Close the modal after submission
      closeQuestionModal();

      // Optionally, you could clear the question text after submission
      // setQuestionText("");
    }
  };

  // Define referenceData inside the component to access the modal functions
  const referenceData = [
    {
      id: 1,
      title: "Curriculum",
      icon: <BookOpen size={20} />,
      path: "#curriculum",
    },
    {
      id: 2,
      title: "Comments",
      icon: <MessageSquare size={20} />,
      path: "#comments",
    },
    {
      id: 3,
      title: "Ask a question",
      icon: <HelpCircle size={20} />,
      onClick: openQuestionModal,
    },
    {
      id: 4,
      title: "Leaderboard",
      icon: <Trophy size={20} />,
      onClick: openLeaderboardModal,
    },
  ];

  return (
    <>
      <ul className="flex gap-4">
        {referenceData.slice(0, 2).map((item) => (
          <li
            key={item.id}
            className="relative flex items-center border w-10 h-10 rounded-full justify-center gap-2 text-gray-500 hover:bg-slate-100 cursor-pointer group"
            onMouseEnter={() => setActiveTooltip(item.id)}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <button
              onClick={() => item.path && handleScroll(item.path)}
              className="flex items-center justify-center gap-2 w-full h-full rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              aria-label={item.title}
            >
              {item.icon}
            </button>
            {activeTooltip === item.id && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                {item.title}
              </div>
            )}
          </li>
        ))}
        {referenceData.slice(2, 4).map((item) => (
          <li
            key={item.id}
            className="relative flex items-center border w-10 h-10 rounded-full justify-center gap-2 hover:bg-slate-100 cursor-pointer group"
            onMouseEnter={() => setActiveTooltip(item.id)}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <button
              onClick={item.onClick}
              className="flex items-center justify-center gap-2 text-gray-500 w-full h-full rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              aria-label={item.title}
            >
              {item.icon}
            </button>
            {activeTooltip === item.id && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                {item.title}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Question Modal */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={closeQuestionModal}
        savedQuestion={questionText}
        onQuestionChange={handleQuestionChange}
        onSubmit={handleSubmitQuestion}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardModalOpen}
        onClose={closeLeaderboardModal}
        progressPercentage={studentProgress}
        courseName={courseName}
      />
    </>
  );
};

export default ReferenceSection;
