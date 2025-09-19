import { apiFetch } from '@/hooks/apiFetch';
import { COMMENTS_PATH } from 'lib/config';

export const commentService = {
  getComments: async (photoId: string, accessToken?: string) => {
    try {
      const headers: HeadersInit = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await apiFetch(COMMENTS_PATH.GET_COMMENTS(photoId), {
        method: 'GET',
        headers,
      });

      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  addComment: async (photoId: string, commentText: string, accessToken: string | null, parentCommentId?: string) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };

      const body: { text: string; parentComment?: string } = {
        text: commentText,
      };

      if (parentCommentId) {
        body.parentComment = parentCommentId;
      }

      const response = await apiFetch(COMMENTS_PATH.ADD_COMMENT(photoId), {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  //Delete Comments
  deleteComment: async (commentId: string, accessToken: string | null) => {
    try {
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await apiFetch(COMMENTS_PATH.DELETE_COMMENT(commentId), {
        method: 'DELETE',
        headers,
      });

      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
