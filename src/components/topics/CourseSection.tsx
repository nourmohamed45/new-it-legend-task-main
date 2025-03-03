import { CourseSection as CourseSectionType } from "./types";
import CourseItem from "./CourseItem";
import { CourseItem as CourseItemType } from "./types";
import { isItemLocked, CourseProgress } from "./utils";
import { courseSections } from "./courseData";

interface CourseSectionProps {
  section: CourseSectionType;
  sectionIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
  onItemClick: (
    item: CourseItemType,
    sectionIndex: number,
    itemIndex: number
  ) => void;
  courseProgress: CourseProgress;
}

const CourseSection = ({
  section,
  sectionIndex,
  isExpanded,
  onToggle,
  onItemClick,
  courseProgress,
}: CourseSectionProps) => {
  return (
    <div className="rounded-lg mb-4 overflow-hidden">
      {/* Section header (clickable to expand/collapse) */}
      <div
        className="user-select-none p-3 bg-transparent flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">
            {section.title}
          </span>
          {section.current && (
            <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
              Current
            </span>
          )}
        </div>
        <span className="text-sm font-bold text-gray-600">
          {isExpanded ? "–" : "+"}
        </span>
      </div>

      {/* Collapsible content (items) */}
      {isExpanded && (
        <div className="p-3 bg-white">
          {section.items.map((item, itemIndex) => (
            <CourseItem
              key={itemIndex}
              item={item}
              locked={isItemLocked(
                courseSections,
                sectionIndex,
                itemIndex,
                courseProgress
              )}
              onClick={() => onItemClick(item, sectionIndex, itemIndex)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseSection;
