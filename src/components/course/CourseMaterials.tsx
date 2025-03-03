import { CourseMaterialsProps } from "./types";
import CourseInfoCard from "./CourseInfoCard";

const CourseMaterials = ({ courseData, isWide }: CourseMaterialsProps) => {
  return (
    <div className={`${isWide ? "" : "my-8"}`}>
      <h2 className="text-2xl font-medium mb-6">Course Materials</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CourseInfoCard courseData={courseData} />
        <CourseInfoCard courseData={courseData} />
      </div>
    </div>
  );
};

export default CourseMaterials;
