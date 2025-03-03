import { Clock, BookOpen, Users, Globe } from "lucide-react";
import { CourseData } from "./types";
import InfoItem from "./InfoItem";

const CourseInfoCard = ({ courseData }: { courseData: CourseData }) => {
  const infoItems = [
    {
      icon: <Clock size={20} />,
      label: "Duration",
      value: courseData.duration,
    },
    {
      icon: <BookOpen size={20} />,
      label: "Lessons",
      value: courseData.lessons,
    },
    {
      icon: <Users size={20} />,
      label: "Enrolled",
      value: courseData.enrolled,
    },
    {
      icon: <Globe size={20} />,
      label: "Language",
      value: courseData.language,
      isLast: true,
    },
  ];

  return (
    <div className="shadow-sm rounded-lg p-6 space-y-6">
      {infoItems.map((item, index) => (
        <InfoItem
          key={index}
          icon={item.icon}
          label={item.label}
          value={item.value}
          isLast={item.isLast}
        />
      ))}
    </div>
  );
};

export default CourseInfoCard;
