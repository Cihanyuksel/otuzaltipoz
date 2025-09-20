'use client';
//nextjs and react
import Image from 'next/image';
import { useState, useEffect } from 'react';
//third-party
import { useRouter } from 'next/navigation';
import { RiDeleteBin6Line as DeleteIcon } from 'react-icons/ri';
//project-files
import DeleteConfirmCommentModal from '../common/confirm-modal';
import ReplyForm from './ReplyForm';
import { commentFormatDate } from 'lib/commentFormatDate';
import { truncateText } from 'lib/truncateText';

export interface Comment {
  _id: string;
  text: string;
  created_at: string;
  user: {
    _id?: string;
    username: string;
    profile_img_url: string;
  };
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  photoId: string;
  accessToken: string | null;
  currentUser?: { _id: string; username: string } | null;
  userPhoto?: string;
  depth?: number;
  onReply: (parentId: string, replyText: string) => void;
  onDelete: (commentId: string) => void;
  isReplying?: boolean;
  isDeleting?: boolean;
}

export default function CommentItem({
  comment,
  photoId,
  accessToken,
  currentUser,
  userPhoto,
  depth = 0,
  onReply,
  onDelete,
  isReplying,
  isDeleting,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseDeleteModal = () => setDeleteModal(false);
  const handleOpenDeleteModel = () => setDeleteModal(true);

  const actualDepth = Math.min(depth, 1);
  const paddingLeft = actualDepth > 0 ? `${actualDepth * 20}px` : '0px';

  const isOwnComment = currentUser && comment.user.username === currentUser.username;
  const isLoggedIn = !!accessToken;

  const handleReplySubmit = (text: string) => {
    onReply(comment._id, text);
    setShowReplyForm(false);
  };

  const handleReplyClick = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    setShowReplyForm(!showReplyForm);
  };

  const MAX_COMMENT_LENGTH = 50;
  const truncatedCommentText = truncateText(comment.text, MAX_COMMENT_LENGTH);

  return (
    <div
      style={{ paddingLeft }}
      className={`flex items-start gap-4 mb-6 transition-all duration-300 transform relative ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <Image
        src={comment.user?.profile_img_url || '/no_profile.png'}
        alt={`${comment.user.username} Profil Resmi`}
        width={40}
        height={40}
        className="h-10 w-10 object-cover flex-shrink-0 rounded-full"
      />
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{comment.user?.username}</span>
              <span className="text-xs text-gray-500">
                • {commentFormatDate(comment.created_at)}
              </span>
            </div>
            {isOwnComment && (
              <button
                onClick={handleOpenDeleteModel}
                className="flex items-center gap-1 text-red-500 transition-all duration-200 hover:text-red-700 hover:scale-105 text-xs p-1 disabled:opacity-50 cursor-pointer"
                title="Yorumu sil"
              >
                <DeleteIcon size={12} />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-700">{comment.text}</p>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={handleReplyClick}
            className={`text-xs font-medium transition-colors ${
              isLoggedIn
                ? 'text-[#ef7464] hover:underline cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            disabled={!isLoggedIn}
          >
            Yanıtla
          </button>
          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-xs font-medium text-gray-500 hover:underline"
            >
              {showReplies ? 'Yanıtları Gizle' : `Yanıtları Gör (${comment.replies.length})`}
            </button>
          )}
        </div>

        {showReplyForm && accessToken && (
          <ReplyForm
            userPhoto={userPhoto}
            onSubmit={handleReplySubmit}
            isSubmitting={isReplying}
            replyingTo={comment.user.username}
            onCancel={() => setShowReplyForm(false)}
          />
        )}

        {showReplies && comment.replies && (
          <div className="mt-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                photoId={photoId}
                accessToken={accessToken}
                currentUser={currentUser}
                userPhoto={userPhoto}
                depth={depth + 1}
                onReply={onReply}
                onDelete={onDelete}
                isReplying={isReplying}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmCommentModal
        isOpen={deleteModal}
        onClose={handleCloseDeleteModal}
        title="Yorumu Sil"
        message={
          <>
            <strong>{truncatedCommentText}</strong> isimli yorumunuzu silmek istediğinizden emin
            misiniz? Bu işlem geri alınamaz.
          </>
        }
        onConfirm={() => onDelete(comment._id)}
        confirmButtonText="Sil"
        isConfirming={isDeleting}
        modalType="delete-comment"
      />
    </div>
  );
}
