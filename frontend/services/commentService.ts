import axios from 'axios';
import { API_BASE_URL, COMMENTS_PATH } from 'lib/config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, 
});

export const commentService = {
  getComments: async (photoId: string, accessToken?: string) => {
    try {
      const headers: Record<string, string> = {};
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await apiClient.get(COMMENTS_PATH.GET_COMMENTS(photoId), {
        headers,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  addComment: async (photoId: string, commentText: string, accessToken: string | null, parentCommentId?: string) => {
    try {
      if (!accessToken) {
        throw new Error('Authentication required');
      }

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

      const response = await apiClient.post(COMMENTS_PATH.ADD_COMMENT(photoId), body, {
        headers,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  deleteComment: async (commentId: string, accessToken: string | null) => {
    try {
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await apiClient.delete(COMMENTS_PATH.DELETE_COMMENT(commentId), {
        headers,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};