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