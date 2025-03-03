import { ArrowRight } from "lucide-react";
import { useState } from "react";
import CommentsCard from "./CommentsCard";

export interface Comment {
  id: number;
  image: string;
  name: string;
  comment: string;
  date: string;
}

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment?: (comment: string) => void;
}

const CommentsSection = ({ comments, onAddComment }: CommentsSectionProps) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = () => {
    if (commentText.trim() && onAddComment) {
      onAddComment(commentText);
      setCommentText(""); // Clear the input after submission
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSubmitComment();
    }
  };

  return (
    <div id="comments">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-medium">Comments</h2>
      </div>

      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <CommentsCard key={comment.id} comment={comment} />
        ))}
      </div>

      <div className="mt-4">
        <textarea
          className="w-full p-4 shadow-md rounded-md resize-none"
          placeholder="Write a comment..."
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-[#41b69d] text-white px-4 py-2 mt-4 rounded-md hover:bg-[#389e88] transition-colors flex items-center"
          onClick={handleSubmitComment}
          disabled={!commentText.trim()}
        >
          Submit Review <ArrowRight size={12} className="inline ml-1" />
        </button>
      </div>
    </div>
  );
};

export default CommentsSection;
