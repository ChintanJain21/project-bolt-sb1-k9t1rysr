import { gql } from '@apollo/client';

export const GET_USER_CHATS = gql`
  query GetUserChats {
    chats(order_by: {updated_at: desc}) {
      id
      user_id
      title
      created_at
      updated_at
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($chatId: uuid!) {
    messages(where: {chat_id: {_eq: $chatId}}, order_by: {created_at: asc}) {
      id
      chat_id
      user_id
      content
      is_bot
      created_at
    }
  }
`;