export const breadcrumbData = [
    {
        label: 'Courses',
        path: '/courses'
    },
    {
        label: 'Course Details',
        path: '/courses/details'
    }
]

export const courseData = {
    duration: "3 weeks",
    lessons: 8,
    enrolled: "65 students",
    language: "English",
};

export const comments = [
    {
        id: 1,
        name: "Student Name Goes Here",
        comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
        date: "2021-01-01",
        image: "/avatars/man.png"
    },
    {
        id: 2,
        name: "Student Name Goes Here",
        comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
        date: "2021-01-01",
        image: "/avatars/woman.png"
    },
    {
        id: 3,
        name: "Student Name Goes Here",
        comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
        date: "2021-01-01",
        image: "/avatars/gamer.png"
    }
]

// Exam interfaces
export interface ExamQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer?: number; // Index of the correct answer (0-based)
}
  
export interface Exam {
    id: string;
    title: string;
    questions: ExamQuestion[];
    duration: number; // in minutes
}

// Exam data
export const exams: Record<string, Exam> = {
    "course-quiz": {
        id: "course-quiz",
        title: "Course Quiz",
        questions: [
            {
                id: 1,
                question: "Among the following states of India, which one has the oldest rock formations in the country?",
                options: ["Assam", "Bihar", "Karnataka", "Uttar Pradesh"],
                correctAnswer: 1 // Bihar
            },
            {
                id: 2,
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correctAnswer: 2 // Paris
            },
            {
                id: 3,
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correctAnswer: 1 // Mars
            },
            {
                id: 4,
                question: "What is the largest ocean on Earth?",
                options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
                correctAnswer: 3 // Pacific Ocean
            },
            {
                id: 5,
                question: "Who wrote 'Romeo and Juliet'?",
                options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                correctAnswer: 1 // William Shakespeare
            }
        ],
        duration: 10 // 10 minutes
    },
    "functions-quiz": {
        id: "functions-quiz",
        title: "Functions Quiz",
        questions: [
            {
                id: 1,
                question: "Which of the following correctly declares a function in JavaScript?",
                options: [
                    "function = myFunction() {}",
                    "function myFunction() {}",
                    "var function = myFunction() {}",
                    "function:myFunction() {}"
                ],
                correctAnswer: 1
            },
            {
                id: 2,
                question: "How do you call a function named 'myFunction'?",
                options: [
                    "call myFunction()",
                    "myFunction()",
                    "call function myFunction()",
                    "Call.myFunction()"
                ],
                correctAnswer: 1
            }
        ],
        duration: 5
    }
};
