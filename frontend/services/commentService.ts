// services/commentService.ts
import { axiosInstance } from 'lib/axiosInstance';
import { COMMENTS_PATH } from 'lib/config';
import { IComment, AddCommentResponse, DeleteCommentResponse, UpdateCommentResponse } from 'types/comment';

export const commentService = {
  getComments: async (photoId: string): Promise<IComment[]> => {
    const { data } = await axiosInstance.get(COMMENTS_PATH.GET_COMMENTS(photoId));
    return data;
  },

  addComment: async (photoId: string, commentText: string, parentCommentId?: string): Promise<AddCommentResponse> => {
    const body: { text: string; parentComment?: string } = { text: commentText };
    if (parentCommentId) body.parentComment = parentCommentId;

    const { data } = await axiosInstance.post(COMMENTS_PATH.ADD_COMMENT(photoId), body);
    return data;
  },

  updateComment: async (commentId: string, commentText: string): Promise<UpdateCommentResponse> => {
    const { data } = await axiosInstance.put(COMMENTS_PATH.UPDATE_COMMENT(commentId), { text: commentText }); // patch -> put
    return data;
  },

  deleteComment: async (commentId: string): Promise<DeleteCommentResponse> => {
    const { data } = await axiosInstance.delete(COMMENTS_PATH.DELETE_COMMENT(commentId));
    return data;
  },
};
