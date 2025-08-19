export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  user_id: string;
  content: string;
  is_bot: boolean;
  created_at: string;
}

export interface MessageResponse {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  success: boolean;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}