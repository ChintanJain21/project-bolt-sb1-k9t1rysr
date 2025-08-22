import React, { useEffect, useRef } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { useAuthenticationStatus, useUserData } from '@nhost/react';
import { GET_CHAT_MESSAGES } from '../graphql/queries';
import { SUBSCRIBE_TO_MESSAGES } from '../graphql/subscriptions';
import { Message } from '../types/database';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { MessageCircle, Loader2, Sparkles } from 'lucide-react';

interface ChatAreaProps {
  chatId: string | null;
  currentUserId: string;
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
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-violet-400" />
            <div className="absolute inset-0 w-8 h-8 bg-violet-400/20 rounded-full blur-xl mx-auto"></div>
          </div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!chatId) {
   return (
  <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
    {/* Background particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-violet-400/40 rounded-full animate-bounce delay-300"></div>
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-400/40 rounded-full animate-bounce delay-700"></div>
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-bounce delay-1000"></div>
    </div>

    <div className="text-center max-w-md mx-auto p-8 relative z-10">
      <div className="relative mb-8">
        <div className="bg-gradient-to-tr from-violet-600 to-purple-700 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/25 transform hover:scale-105 transition-all duration-500">
          <MessageCircle className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -inset-3 bg-gradient-to-tr from-violet-600/30 to-purple-600/30 rounded-3xl blur-2xl -z-10 animate-pulse"></div>
      </div>
      
      <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
        Welcome to AI ChatBot
      </h2>
      
      <p className="text-gray-400 mb-6 leading-relaxed">
        Select an existing chat from the sidebar or create a new one to start your intelligent conversation with our AI assistant.
      </p>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <Sparkles className="w-4 h-4 text-violet-400" />
        <span>Powered by advanced AI technology</span>
      </div>
    </div>
  </div>
);
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="relative">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-violet-400" />
                <div className="absolute inset-0 w-6 h-6 bg-violet-400/20 rounded-full blur-lg mx-auto"></div>
              </div>
              <p className="text-gray-300 text-sm">Loading messages...</p>
            </div>
          </div>
        ) : messagesData?.messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto">
              <div className="relative mb-6">
                <div className="bg-gradient-to-tr from-gray-700 to-gray-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                  <MessageCircle className="w-8 h-8 text-gray-300" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-tr from-gray-600/20 to-gray-500/20 rounded-2xl blur-xl -z-10"></div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">Start the Conversation</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                This is the beginning of your chat with our AI assistant. Send a message below to get started!
              </p>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                <Sparkles className="w-3 h-3 text-violet-400" />
                <span>AI is ready to chat</span>
              </div>
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
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default ChatArea;