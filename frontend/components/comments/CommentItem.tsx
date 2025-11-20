'use client';
//nextjs and react
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//third-party
import { RiDeleteBin6Line as DeleteIcon } from 'react-icons/ri';
//project files
import EditCommentForm from './EditCommentForm';
import ReplyForm from './ReplyForm';
import { commentFormatDate } from 'lib/commentFormatDate';
import { canManage as canManageComment, isAdminOrModerator } from 'lib/permission';
import { IComment } from 'types/comment';
import { User } from 'types/auth';

interface ICommentItem {
  comment: IComment;
  photoId: string;
  accessToken: string | null;
  currentUser?: User | null;
  userPhoto?: string;
  depth?: number;
  onReply: (parentId: string, replyText: string) => void;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, newText: string) => void;
  isReplying?: boolean;
  isDeleting?: boolean;
  isEditing?: boolean;
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
  onEdit,
  isReplying,
  isDeleting,
  isEditing,
}: ICommentItem) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const actualDepth = depth > 0 ? 1 : 0;
  const paddingLeft = actualDepth > 0 ? '20px' : '0px';

  const isOwnComment = !!(currentUser && comment.user.username === currentUser.username);
  const isLoggedIn = !!accessToken;

  const canEdit = isOwnComment && comment.edit_count < 1;
  const isAdmin = currentUser ? isAdminOrModerator(currentUser) : false;

  const handleReplySubmit = (text: string) => {
    onReply(comment._id, text);
    setShowReplyForm(false);
  };

  const handleEditSubmit = (text: string) => {
    onEdit(comment._id, text);
    setShowEditForm(false);
  };

  const handleReplyClick = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    setShowReplyForm(!showReplyForm);
    setShowEditForm(false);
  };

  const handleEditClick = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    setShowEditForm(!showEditForm);
    setShowReplyForm(false);
  };

  const canDelete = canManageComment(currentUser?.role, isOwnComment);

  return (
    <div
      style={{ paddingLeft }}
      className={`flex items-start gap-4 mb-3 transition-all duration-300 transform relative ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <Image
        src={comment.user?.profile_img_url || '/no_profile.png'}
        alt={`${comment.user.username} Profil Resmi`}
        width={40}
        height={40}
        className="h-8 w-8 lg:h-12 lg:w-12 object-cover flex-shrink-0 rounded-full"
      />
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex flex-col lg:justify-center lg:items-center lg:flex-row gap-1 lg:gap-2">
              <span className="font-semibold text-sm">{comment.user?.username}</span>
              <span className="text-xs text-gray-400">
                • {commentFormatDate(comment.created_at)}
                {comment.is_edited && (
                  <span
                    className="text-xs ml-1 text-gray-400"
                    title={`Düzenlendi: ${commentFormatDate(comment.updated_at)}`}
                  >
                    (günc.)
                  </span>
                )}
              </span>
            </div>
            {canDelete && (
              <button
                onClick={() => onDelete(comment._id)}
                className="flex items-center gap-1 text-red-500 transition-all duration-200 hover:text-red-700 hover:scale-105 text-xs p-1 disabled:opacity-50 cursor-pointer"
                title="Yorumu sil"
                aria-label="Yorumu Sil"
              >
                <DeleteIcon size={12} />
              </button>
            )}
          </div>
          <div
            className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${!showEditForm ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} 
        `}
          >
            <p className="text-sm text-gray-700">{comment.text}</p>
          </div>

          <div
            className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${showEditForm ? 'max-h-screen opacity-100 mt-2' : 'max-h-0 opacity-0'}
        `}
          >
            {showEditForm && (
              <EditCommentForm
                initialText={comment.text}
                onSubmit={handleEditSubmit}
                isSubmitting={isEditing}
                onCancel={() => setShowEditForm(false)}
              />
            )}
          </div>
        </div>

        {!showEditForm && (
          <div className="flex items-center gap-4 mt-2">
            {!comment.parentComment && (
              <div className="flex gap-2">
                <button
                  onClick={handleReplyClick}
                  className={`text-xs font-medium transition-colors ${
                    isLoggedIn ? 'text-[#ef7464] hover:underline cursor-pointer' : 'text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!isLoggedIn}
                >
                  Yanıtla
                </button>

                {(canEdit || isAdmin) && (
                  <button
                    onClick={handleEditClick}
                    className={`text-xs font-medium transition-colors ${
                      isLoggedIn ? 'text-[#ef7464] hover:underline cursor-pointer' : 'text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!isLoggedIn}
                    title={!canEdit && !isAdmin ? 'Düzenleme hakkınız doldu' : 'Yorumu düzenle'}
                  >
                    Düzenle
                  </button>
                )}
              </div>
            )}
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs font-medium text-gray-500 hover:underline"
              >
                {showReplies ? 'Yanıtları Gizle' : `Yanıtları Gör (${comment.replies.length})`}
              </button>
            )}
          </div>
        )}

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
                depth={1}
                onReply={onReply}
                onDelete={onDelete}
                onEdit={onEdit}
                isReplying={isReplying}
                isDeleting={isDeleting}
                isEditing={isEditing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
