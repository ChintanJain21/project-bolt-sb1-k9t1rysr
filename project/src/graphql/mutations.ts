import { gql } from '@apollo/client';

// ✅ Create a new chat (requires user_id)
export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!, $user_id: uuid!) {
    insert_chats_one(object: {title: $title, user_id: $user_id}) {
      id
      title
      created_at
      updated_at
    }
  }
`;

// ✅ Insert a new user message (requires chatId, user_id, content)
export const INSERT_USER_MESSAGE = gql`
  mutation InsertUserMessage($chatId: uuid!, $user_id: uuid!, $content: String!) {
    insert_messages_one(object: {
      chat_id: $chatId,
      user_id: $user_id,
      content: $content,
      is_bot: false
    }) {
      id
      chat_id
      user_id
      content
      created_at
    }
  }
`;


// ✅ Send message (custom action, already okay)
export const SEND_MESSAGE = gql`
  mutation SendMessage($chat_id: uuid!, $content: String!) {
    sendMessage(chat_id: $chat_id, content: $content) {
      id
      chat_id
      sender_id
      content
      created_at
      success
      error
    }
  }
`;
