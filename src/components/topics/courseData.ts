import { CourseSection } from "./types";

export const courseSections: CourseSection[] = [
  {
    title: "Course Introduction",
    subtitle: "",
    current: false,
    items: [
      {
        title: "Introduction Video",
        locked: false,
        contentType: "video",
        contentSource: "/video/video.mp4",
        thumbnail: "/video/thumbnail.jpg",
      },
      {
        title: "Course Overview PDF",
        locked: false,
        contentType: "pdf",
        contentSource:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        title: "Course Quiz",
        locked: false,
        contentType: "exam",
        examId: "course-quiz",
        hasQuestion: true,
        questionCount: 5,
        duration: 10,
      },
      {
        title: "Test video completion to make the next item unlocked",
        locked: false,
        contentType: "video",
        contentSource: "/video/video.mp4",
        thumbnail: "/video/thumbnail.jpg",
      },
      {
        title: "Course Exercise / Reference Files",
        locked: true,
        contentType: "pdf",
        contentSource:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        title: "Course Overview PDF",
        locked: false,
        contentType: "pdf",
        contentSource:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  },
  {
    title: "JavaScript Language Basics",
    subtitle: "",
    current: false,
    items: [
      {
        title: "Defining Functions",
        locked: false,
        contentType: "video",
        contentSource: "/video/video.mp4",
        thumbnail: "/video/thumbnail.jpg",
      },
      {
        title: "Function Parameters Documentation",
        locked: false,
        contentType: "pdf",
        contentSource:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        title: "Functions Quiz",
        locked: false,
        contentType: "exam",
        examId: "functions-quiz",
        hasQuestion: true,
        questionCount: 2,
        duration: 5,
      },
    ],
  },
  {
    title: "Components & Databinding",
    subtitle: "",
    current: false,
    items: [
      {
        title: "Defining Functions",
        locked: true,
        contentType: "video",
        contentSource: "/video/video.mp4",
        thumbnail: "/video/thumbnail.jpg",
      },
      {
        title: "Function Parameters",
        locked: true,
        contentType: "pdf",
        contentSource:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        title: "Return Values From Functions",
        locked: false,
        contentType: "exam",
        examId: "course-quiz",
        hasQuestion: true,
        questionCount: 5,
        duration: 10,
      },
      {
        title: "Global Variables and Scope",
        locked: true,
        contentType: "video",
        contentSource: "/video/video.mp4",
        thumbnail: "/video/thumbnail.jpg",
      },
      {
        title: "Newer Way of creating a Constant",
        locked: true,
        contentType: "video",
        contentSource: "/video/video.mp4",
        thumbnail: "/video/thumbnail.jpg",
      },
      {
        title: "Constants",
        locked: true,
        contentType: "pdf",
        contentSource:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  },
];
