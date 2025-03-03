import { useState, useEffect } from "react";
import { ArrowLeft, AlarmClock } from "lucide-react";
import { exams } from "../../data";
import { ExamInterfaceProps } from "./types";
import { examProgressStore, formatTime } from "./utils";

const ExamInterface = ({
  examId,
  onClose,
  onExamComplete,
}: ExamInterfaceProps) => {
  // Get the exam data based on the examId
  const exam = examId ? exams[examId] : null;
  
  // Check if we have saved progress for this exam
  const savedProgress = examId ? examProgressStore[examId] : null;

  // Move all useState hooks before any conditional returns
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    savedProgress && exam ? savedProgress.currentQuestionIndex : 0
  );
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    savedProgress && exam
      ? savedProgress.selectedAnswers
      : exam ? Array(exam.questions.length).fill(-1) : []
  );
  const [timeLeft, setTimeLeft] = useState(
    savedProgress && exam ? savedProgress.timeLeft : exam ? exam.duration * 60 : 0
  );
  const [error, setError] = useState<string | null>(null);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examPassed, setExamPassed] = useState(false);
  const [score, setScore] = useState(0);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [, setExamCompleted] = useState(false);

  // Save progress when component unmounts or when values change
  useEffect(() => {
    if (examId && exam) {
      examProgressStore[examId] = {
        currentQuestionIndex,
        selectedAnswers,
        timeLeft,
      };
    }
  }, [examId, currentQuestionIndex, selectedAnswers, timeLeft, exam]);

  // Timer effect
  useEffect(() => {
    if (!exam || examSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examSubmitted, exam]);

  // Early return if exam not found
  if (!exam) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-medium mb-4">Exam Not Found</h3>
        <p className="text-gray-600 mb-4">
          The requested exam could not be found.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    );
  }

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = optionIndex;
      return newAnswers;
    });
  };

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= exam.questions.length) {
      setError("Invalid question index");
      return;
    }
    setCurrentQuestionIndex(index);
    setError(null);
  };

  const goToPreviousQuestion = () => {
    goToQuestion(currentQuestionIndex - 1);
  };

  const goToNextQuestion = () => {
    goToQuestion(currentQuestionIndex + 1);
  };

  const calculateScore = (): number => {
    if (!exam) return 0;

    let correctAnswers = 0;
    exam.questions.forEach((question, index) => {
      if (
        question.correctAnswer !== undefined &&
        selectedAnswers[index] === question.correctAnswer
      ) {
        correctAnswers++;
      }
    });

    return Math.round((correctAnswers / exam.questions.length) * 100);
  };

  const handleSubmit = () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setExamSubmitted(true);
    setShowScorePopup(true);

    // Consider the exam passed if the score is 90% or higher (changed from 70%)
    const passed = calculatedScore >= 90;
    setExamPassed(passed);

    // Clear the saved progress for this exam only if passed
    if (examId && passed) {
      delete examProgressStore[examId];
    }
  };

  const handleContinue = () => {
    // Mark the exam as completed
    setExamCompleted(true);

    // Call the onExamComplete callback if provided
    if (onExamComplete && examPassed) {
      onExamComplete(examPassed);
    } else {
      // If not passed or no callback, just close the modal
      onClose();
    }
  };

  const handleTryAgain = () => {
    // Reset the exam state
    setExamSubmitted(false);
    setShowScorePopup(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(exam.questions.length).fill(-1));
    setTimeLeft(exam.duration * 60);
    setError(null);
  };

  // If showing the score popup
  if (showScorePopup) {
    return (
      <div className="p-8 flex flex-col h-full bg-gradient-to-b from-blue-50 to-white">
        <h3 className="text-2xl font-bold mb-6 text-center text-blue-800">
          Exam Results
        </h3>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <div
              className={`text-7xl font-bold mb-3 ${
                examPassed ? "text-green-600" : "text-red-600"
              }`}
            >
              {score}%
            </div>
            <div
              className={`text-xl font-medium px-6 py-2 rounded-full ${
                examPassed
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {examPassed ? "Passed!" : "Failed"}
            </div>
          </div>
          <p className="text-gray-700 mb-8 text-center max-w-md">
            {examPassed
              ? `Congratulations! You scored ${score}% on the exam. You have successfully passed and can now proceed to the next section of the course.`
              : `You scored ${score}% on the exam. You need to score at least 90% to pass. Please review the material and try again.`}
          </p>
          <div className="flex gap-4">
            {!examPassed && (
              <button
                onClick={handleTryAgain}
                className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transition-all transform hover:scale-105"
              >
                Try Again
              </button>
            )}
            <button
              onClick={handleContinue}
              className={`px-8 py-3 ${
                examPassed
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-500 hover:bg-gray-600"
              } text-white rounded-full shadow-md transition-all transform hover:scale-105`}
            >
              {examPassed ? "Continue" : "Close"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If the exam is submitted but not showing the popup (this shouldn't happen with current logic)
  if (examSubmitted) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-medium mb-4">Exam Submitted</h3>
        <button
          onClick={() => setShowScorePopup(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Results
        </button>
      </div>
    );
  }

  // Current question
  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="flex flex-col h-full bg-[#3f51b5]">
      {/* Header with timer in center and back button on left - Fixed */}
      <div className="flex items-center justify-between px-4 pb-8 pt-8 relative">
        {/* Back button on left */}
        <button title="back button" onClick={onClose} className="flex items-center text-white z-10">
          <ArrowLeft size={20} />
        </button>

        {/* Timer centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bg-[#ffd600] text-white px-6 py-1 rounded-md font-medium shadow-[0_0_10px_0_#ffd600] flex items-center justify-center w-32">
          <AlarmClock size={24} className="mr-2" />
          <span className="text-base">{formatTime(timeLeft)}</span>
        </div>

        {/* Empty div to balance the layout */}
        <div className="w-5"></div>
      </div>

      {/* Question navigation - Fixed */}
      <div className="flex justify-center gap-4 mb-5">
        {exam.questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => goToQuestion(index)}
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              index === currentQuestionIndex
                ? "bg-white text-[#3f51b5] border-white font-medium"
                : selectedAnswers[index] !== -1
                ? "bg-[#3f51b5] text-white border-white opacity-70"
                : "bg-transparent text-white border-white"
            } shadow-sm`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Main content area with white background, rounded corners, and scrollable content */}
      <div className="flex-1 bg-white rounded-t-3xl flex flex-col overflow-hidden">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-5 pt-6">
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Question card */}
          <div className="mb-5">
            <div className="mb-5">
              <span className="text-gray-700 font-medium text-lg">
                {currentQuestionIndex + 1}.
              </span>
              <p className="text-gray-800 font-medium text-lg mt-1">
                {currentQuestion.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`rounded-lg p-4 flex items-center cursor-pointer shadow-sm transition-all ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? "bg-[#3f51b5] text-white"
                      : "bg-white border border-gray-200 hover:border-[#3f51b5] hover:shadow"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-sm flex items-center justify-center mr-3 ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? "bg-white border border-white"
                        : "border border-gray-400"
                    }`}
                  >
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <div className="w-3 h-3 bg-[#3f51b5]"></div>
                    )}
                  </div>
                  <span
                    className={
                      selectedAnswers[currentQuestionIndex] === index
                        ? "font-medium"
                        : ""
                    }
                  >
                    {option}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation buttons - Fixed at bottom */}
        <div className="flex justify-between p-5 border-t border-gray-100 bg-white">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-5 py-2.5 rounded-lg ${
              currentQuestionIndex === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Previous
          </button>

          {currentQuestionIndex < exam.questions.length - 1 ? (
            <button
              onClick={goToNextQuestion}
              className="px-5 py-2.5 rounded-lg bg-[#3f51b5] text-white hover:bg-[#303f9f]"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;
