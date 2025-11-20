'use client';
import { useState } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { useAuth } from '@/context/AuthContext';
import { useCommentApi } from '@/hooks/api/useCommentApi';
import LoginPrompt from './LoginPrompt';
import Loader from '../common/loader';
import DeleteCommentConfirmModal from '@/components/common/confirm-modal';

interface ICommentSection {
  userPhoto?: string;
  photoId: string;
  onLoginRequired: () => void;
}

export default function CommentSection({ userPhoto, photoId, onLoginRequired }: ICommentSection) {
  const { accessToken, user } = useAuth();
  const isLoggedIn = !!accessToken;

  const [commentIdToDelete, setCommentIdToDelete] = useState<string | null>(null);

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

  const commentCount = comments?.length || 0;

  const handleConfirmDelete = () => {
    if (commentIdToDelete) {
      deleteComment(commentIdToDelete, {
        onSuccess: () => setCommentIdToDelete(null),
      });
    }
  };

  // 1. If Not Logged In
  if (!isLoggedIn) {
    return (
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold mb-6">Yorumlar</h2>
        <LoginPrompt onLogin={onLoginRequired} />
      </div>
    );
  }

  // 2. Loading
  if (isLoadingComments) {
    return (
      <div className="mt-8 border-t border-gray-200 pt-6">
        <CommentForm userPhoto={userPhoto} onSubmit={addComment} isSubmitting={isAddingComment} token={accessToken} />
        <h2 className="text-xl font-semibold mb-6 mt-8">Yorumlar {commentCount > 0 && `(${commentCount})`}</h2>
        <Loader text="Yorumlar yükleniyor..." className="min-h-[200px] py-8" />
      </div>
    );
  }

  // 3. Loaded
  return (
    <div className="mt-8 border-t border-gray-200 pt-6 relative">
      <CommentForm userPhoto={userPhoto} onSubmit={addComment} isSubmitting={isAddingComment} token={accessToken} />

      <h2 className="text-xl font-semibold mb-6 mt-8">Yorumlar {commentCount > 0 && `(${commentCount})`}</h2>

      {commentCount === 0 ? (
        <p className="text-gray-500">Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
      ) : (
        <CommentList
          comments={comments || []}
          photoId={photoId}
          accessToken={accessToken}
          user={user}
          userPhoto={userPhoto}
          onReply={(parentId, text) => addReply({ parentCommentId: parentId, replyText: text })}
          onDelete={(commentId) => setCommentIdToDelete(commentId)}
          onEdit={(id, text) => updateComment({ commentId: id, commentText: text })}
          isAddingReply={isAddingReply}
          isDeletingComment={isDeletingComment}
          isUpdatingComment={isUpdatingComment}
        />
      )}

      <DeleteCommentConfirmModal
        isOpen={!!commentIdToDelete}
        onClose={() => setCommentIdToDelete(null)}
        title="Yorumu Sil"
        message="Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        onConfirm={handleConfirmDelete}
        confirmButtonText="Sil"
        isConfirming={isDeletingComment}
        modalType="delete-comment"
      />
    </div>
  );
}
