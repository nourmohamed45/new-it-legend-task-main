import { ReactNode } from "react";

export interface CourseData {
  duration: string;
  lessons: number;
  enrolled: string;
  language: string;
}

export interface CourseMaterialsProps {
  courseData: CourseData;
  isWide?: boolean;
}

export interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  isLast?: boolean;
} 