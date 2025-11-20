'use client';
import { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import { IComment } from 'types/comment';
import { User } from 'types/auth';

interface ICommentList {
  comments: IComment[];
  photoId: string;
  accessToken: string | null;
  user: User | null;
  userPhoto?: string;
  onReply: (parentId: string, text: string) => void;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, newText: string) => void;
  isAddingReply: boolean;
  isDeletingComment: boolean;
  isUpdatingComment: boolean;
}

export default function CommentList({ comments, ...props }: ICommentList) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        transition-all duration-500 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          {...props}
          currentUser={props.user}
          isReplying={props.isAddingReply}
          isDeleting={props.isDeletingComment}
          isEditing={props.isUpdatingComment}
        />
      ))}
    </div>
  );
}
