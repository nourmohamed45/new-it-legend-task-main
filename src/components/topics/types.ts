// Define content types
export type ContentType = "video" | "pdf" | "exam" | "default";

export interface CourseItem {
  title: string;
  locked: boolean;
  contentType?: ContentType;
  contentSource?: string;
  thumbnail?: string;
  examId?: string;
  hasQuestion?: boolean;
  questionCount?: number;
  duration?: number;
}

export interface CourseSection {
  title: string;
  subtitle: string;
  items: CourseItem[];
  current?: boolean;
}

// Interface for exam progress
export interface ExamProgress {
  currentQuestionIndex: number;
  selectedAnswers: number[];
  timeLeft: number;
}

// Modal component for PDF and Exam
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  contentType: ContentType;
  contentSource?: string;
  examId?: string;
  onExamComplete?: (passed: boolean) => void;
}

export interface ExamInterfaceProps {
  examId?: string;
  onClose: () => void;
  onExamComplete?: (passed: boolean) => void;
} 