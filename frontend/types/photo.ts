type PhotoDocument = {
  _id: string;
  user_id: {
    _id: string;
    username: string;
    email: string;
    created_at: string;
    profile_img_url: string;
  };
  photo_url: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  __v: number;
  likes?: number;
};
