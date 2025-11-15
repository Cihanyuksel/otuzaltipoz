'use client';
import { useState, useEffect } from 'react';
import { PiDotsThreeCircle as ThreeDot } from 'react-icons/pi';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import Button from '../common/button';
import { useAuth } from '@/context/AuthContext';
import { useCommentApi } from '@/hooks/api/useCommentApi';
import { IComment } from 'types/comment';

function LoginPrompt({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="z-10 flex flex-col items-center justify-center bg-opacity-80 rounded-lg text-center p-8 bg-white">
      <ThreeDot size={80} className="mb-5 text-gray-500" />
      <p className="text-xl text-gray-700 font-semibold mb-2">Yorumları görmek ister misin?</p>
      <p className="text-sm text-gray-500 mb-6">
        Yorumları görüntülemek ve kendi yorumunu bırakmak için giriş yapmalısın.
      </p>
      <Button onClick={onLogin} variant="primary" size="medium">
        Giriş Yap
      </Button>
    </div>
  );
}

export default function CommentSection({
  userPhoto,
  photoId,
  onLoginRequired,
}: {
  userPhoto?: string;
  photoId: string;
  onLoginRequired: () => void;
}) {
  const { accessToken, user } = useAuth();
  const isLoggedIn = !!accessToken;

  const [isCommentsVisible, setIsCommentsVisible] = useState(false);

  const {
    comments,
    isLoadingComments,
    isAddingComment,
    addComment,
    addReply,
    isAddingReply,
    updateComment,
    isUpdatingComment,
    deleteComment,
    isDeletingComment,
  } = useCommentApi(photoId, accessToken);

  useEffect(() => {
    if (!isLoadingComments) {
      const timer = setTimeout(() => setIsCommentsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoadingComments]);

  const handleAddComment = (text: string) => addComment(text);
  const handleAddReply = (parentId: string, text: string) => addReply({ parentCommentId: parentId, replyText: text });
  const handleEditComment = (commentId: string, newText: string) => updateComment({ commentId, commentText: newText });
  const handleDeleteComment = (commentId: string) => deleteComment(commentId);
  
  const handleLoginRequest = () => {
    if (!isLoggedIn) onLoginRequired();
  };

  const commentCount = comments?.length || 0;
  const hasComments = commentCount > 0;

  // Early returns ile conditional rendering
  if (isLoadingComments && isLoggedIn) {
    return (
      <div className="mt-8 border-t border-gray-200 pt-6">
        <CommentForm
          userPhoto={userPhoto}
          onSubmit={handleAddComment}
          isSubmitting={isAddingComment}
          token={accessToken}
        />
        <h2 className="text-xl font-semibold mb-6 mt-8">Yorumlar ({commentCount})</h2>
        <p className="text-gray-500">Yorumlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <CommentForm
        userPhoto={userPhoto}
        onSubmit={handleAddComment}
        isSubmitting={isAddingComment}
        token={accessToken}
      />
      <h2 className="text-xl font-semibold mb-6 mt-8">Yorumlar ({commentCount})</h2>

      {!hasComments && <p className="text-gray-500">Henüz yorum yapılmamış.</p>}

      {!isLoggedIn && hasComments && <LoginPrompt onLogin={handleLoginRequest} />}

      {isLoggedIn && hasComments && (
        <div
          className={`
            transition-all duration-500 transform
            ${isCommentsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          {comments?.map((comment: IComment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              photoId={photoId}
              accessToken={accessToken}
              currentUser={user}
              userPhoto={userPhoto}
              onReply={handleAddReply}
              onDelete={handleDeleteComment}
              onEdit={handleEditComment}
              isReplying={isAddingReply}
              isDeleting={isDeletingComment}
              isEditing={isUpdatingComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
