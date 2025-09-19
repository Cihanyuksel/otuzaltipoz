'use client';
import { useAuth } from '@/context/AuthContext';
import { useCommentApi } from '@/hooks/useCommentApi';
import CommentForm from './CommentForm';
import CommentItem, { Comment } from './CommentItem';

export default function CommentSection({ userPhoto, photoId }: { userPhoto?: string; photoId: string }) {
  const { accessToken, user } = useAuth();

  const { comments, isLoadingComments, isAddingComment, addComment, addReply, isAddingReply, deleteComment, isDeletingComment } = useCommentApi(
    photoId,
    accessToken || undefined
  );

  const handleAddComment = (text: string) => {
    if (accessToken) {
      addComment(text);
    }
  };

  const handleAddReply = (parentId: string, text: string) => {
    if (accessToken) {
      addReply({ parentCommentId: parentId, replyText: text });
    }
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId);
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <CommentForm userPhoto={userPhoto} onSubmit={handleAddComment} isSubmitting={isAddingComment} />

      <h2 className="text-xl font-semibold mb-6 mt-8">Yorumlar ({comments?.length || 0})</h2>

      {isLoadingComments ? (
        <p className="text-gray-500">Yorumlar yükleniyor...</p>
      ) : comments?.length > 0 ? (
        comments.map((comment: Comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            photoId={photoId}
            accessToken={accessToken}
            currentUser={user}
            userPhoto={userPhoto}
            onReply={handleAddReply}
            onDelete={handleDeleteComment}
            isReplying={isAddingReply}
            isDeleting={isDeletingComment}
          />
        ))
      ) : (
        <p className="text-gray-500">Henüz yorum yapılmamış.</p>
      )}
    </div>
  );
}
