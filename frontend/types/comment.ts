export interface IUser {
  _id: string;
  username: string;
  avatar?: string;
}

export interface IComment {
  _id: string;
  text: string;
  user: IUser;
  photo: string;
  parentComment: string | null;
  isDeleted: boolean;
  created_at: string;
  updated_at: string;
  replies?: IComment[];
}

export type CommentUser = {
  _id: string;
  fullName: string;
  username: string;
  avatar?: string; // opsiyonel
};

export type AddCommentResponse = {
  _id: string;
  text: string;
  user: string; 
  photo: string;
  parentComment: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export type DeleteCommentResponse = {
  message: string; 
};