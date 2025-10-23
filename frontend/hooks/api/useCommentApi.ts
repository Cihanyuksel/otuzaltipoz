import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from 'services/commentService';

export const useCommentApi = (photoId: string) => {
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['comments', photoId],
    queryFn: () => commentService.getComments(photoId),
    staleTime: 1000 * 60 * 5,
  });

  //add comment
  const addCommentMutation = useMutation({
    mutationFn: (commentText: string) => commentService.addComment(photoId, commentText),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', photoId] });
    },

    onError: (err) => {
      console.error('Yorum eklenirken hata oluştu:', err);
    },
  });

  //add reply
  const addReplyMutation = useMutation({
    mutationFn: (data: { parentCommentId: string; replyText: string }) =>
      commentService.addComment(photoId, data.replyText, data.parentCommentId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', photoId] });
    },
    onError: (err) => {
      console.error('Yanıt eklenirken hata oluştu:', err);
    },
  });

  //update comment
  const updateCommentMutation = useMutation({
    mutationFn: (data: { commentId: string; commentText: string }) =>
      commentService.updateComment(data.commentId, data.commentText),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', photoId] });
    },
    onError: (err) => {
      console.error('Yorum güncellenirken hata oluştu:', err);
    },
  });

  //delete comments
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', photoId] });
    },
    onError: (err) => {
      console.error('Yorum silinirken hata oluştu:', err.message);
    },
  });

  return {
    comments,
    isLoadingComments: isLoading,
    isErrorComments: isError,
    commentsError: error,
    addComment: addCommentMutation.mutate,
    isAddingComment: addCommentMutation.isPending,
    addCommentError: addCommentMutation.error,
    addReply: addReplyMutation.mutate,
    isAddingReply: addReplyMutation.isPending,
    addReplyError: addReplyMutation.error,
    updateComment: updateCommentMutation.mutate,
    isUpdatingComment: updateCommentMutation.isPending,
    updateCommentError: updateCommentMutation.error,
    deleteComment: deleteCommentMutation.mutate,
    isDeletingComment: deleteCommentMutation.isPending,
    deleteCommentError: deleteCommentMutation.error,
  };
};
