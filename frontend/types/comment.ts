export interface IUser {
  _id: string;
  username: string;
  avatar?: string;
  profile_img_url?: string;
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
  edit_count: number;  
  is_edited: boolean; 
  replies?: IComment[];
}


export type CommentUser = {
  _id: string;
  fullName: string;
  username: string;
  avatar?: string;
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

export interface UpdateCommentResponse {
  message: string;
  comment: IComment;
}