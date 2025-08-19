import { gql } from '@apollo/client';

export const SUBSCRIBE_TO_MESSAGES = gql`
  subscription SubscribeToMessages($chatId: uuid!) {
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

export const SUBSCRIBE_TO_CHATS = gql`
  subscription SubscribeToChats {
    chats(order_by: {updated_at: desc}) {
      id
      title
      updated_at
    }
  }
`;