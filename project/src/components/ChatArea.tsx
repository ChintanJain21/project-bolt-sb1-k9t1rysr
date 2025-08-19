import React, { useEffect, useRef } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { useAuthenticationStatus, useUserData } from '@nhost/react';
import { GET_CHAT_MESSAGES } from '../graphql/queries';
import { SUBSCRIBE_TO_MESSAGES } from '../graphql/subscriptions';
import { Message } from '../types/database';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { MessageCircle, Loader2 } from 'lucide-react';

interface ChatAreaProps {
  chatId: string | null;
  currentUserId: string; // ✅ add this
}

const ChatArea: React.FC<ChatAreaProps> = ({ chatId, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuthenticationStatus();
  const user = useUserData();

  const { data: messagesData, loading } = useQuery(GET_CHAT_MESSAGES, {
    variables: { chatId },
    skip: !chatId,
    errorPolicy: 'all',
  });

  useSubscription(SUBSCRIBE_TO_MESSAGES, {
    variables: { chatId },
    skip: !chatId,
    onSubscriptionData: ({ client }) => {
      client.refetchQueries({
        include: [GET_CHAT_MESSAGES],
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesData?.messages]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to Your Chat</h2>
          <p className="text-gray-600 mb-6">
            Select an existing chat from the sidebar or create a new one to start your conversation with our AI assistant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-gray-600 text-sm">Loading messages...</p>
            </div>
          </div>
        ) : messagesData?.messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start the Conversation</h3>
              <p className="text-gray-600 text-sm">
                This is the beginning of your chat. Send a message below to get started!
              </p>
            </div>
          </div>
        ) : (
          <>
            {messagesData?.messages?.map((message: Message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={message.user_id === user.id}
              />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <MessageInput
        chatId={chatId}
        onMessageSent={scrollToBottom}
        currentUserId={currentUserId} // ✅ pass it here
      />
    </div>
  );
};

export default ChatArea;
