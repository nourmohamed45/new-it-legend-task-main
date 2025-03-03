import { Lock, FileText, Video, FileQuestion, Unlock } from "lucide-react";
import { CourseItem as CourseItemType } from "./types";

interface CourseItemProps {
  item: CourseItemType;
  locked: boolean;
  onClick: () => void;
}

const CourseItem = ({ item, locked, onClick }: CourseItemProps) => {
  // Get icon based on content type
  const getItemIcon = (item: CourseItemType) => {
    if (item.contentType === "video") {
      return <Video size={16} className="text-gray-400" />;
    } else if (item.contentType === "pdf") {
      return <FileText size={16} className="text-gray-400" />;
    } else if (item.contentType === "exam") {
      return <FileQuestion size={16} className="text-gray-400" />;
    } else {
      return <FileText size={16} className="text-gray-400" />;
    }
  };

  return (
    <div
      className={`flex items-center py-2 px-2 justify-between gap-2 border-t border-gray-200 ${
        !locked ? "cursor-pointer hover:bg-gray-50" : ""
      }`}
      onClick={locked ? undefined : onClick}
    >
      <div className="flex items-center gap-2">
        {item.contentType === "video" && item.thumbnail ? (
          <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <Video size={14} className="text-white" />
            </div>
          </div>
        ) : (
          getItemIcon(item)
        )}
        <span
          className={`text-sm ${locked ? "text-gray-400" : "text-gray-800"}`}
        >
          {item.title}
        </span>
        {!locked && item.locked && (
          <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
            Unlocked
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {item.hasQuestion && (
          <div className="flex flex-wrap gap-2 justify-end">
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
              {item.questionCount} QUESTION
            </span>
            <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded">
              {item.duration} MINUTES
            </span>
          </div>
        )}
        {locked ? (
          <Lock size={16} className="text-gray-400" />
        ) : (
          <Unlock size={16} className="text-green-500" />
        )}
      </div>
    </div>
  );
};

export default CourseItem;
