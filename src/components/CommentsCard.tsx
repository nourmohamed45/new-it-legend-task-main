import { Comment } from "./CommentsSection";

const CommentsCard = ({ comment }: { comment: Comment }) => {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-200 last:border-b-0">
      <img
        src={comment.image}
        alt={comment.name}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-sm font-medium">{comment.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{comment.date}</p>
        </div>
        <p className="text-sm text-gray-500">{comment.comment}</p>
      </div>
    </div>
  );
};

export default CommentsCard;
