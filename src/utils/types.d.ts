export type Post = {
  id: string,
  image_count: number,
  text_content: string,
  user: User,
  created_at: string,
}

export type User = {
  id: string,
  username: string,
  created_at: string, 
}

export type PostComment = {
  id: string,
  content: string,
  user: User,
  number_of_replies: number,
  created_at: string,
}

export type CommentReply = {
  id: string,
  content: string,
  user: User,
  created_at: string,
}

export type SessionUser = {
  userInfo?: User,
  accessToken?: string,
  isGuest: boolean,
}