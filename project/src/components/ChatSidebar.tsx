import React, { useState } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { GET_USER_CHATS } from '../graphql/queries';
import { CREATE_CHAT } from '../graphql/mutations';
import { SUBSCRIBE_TO_CHATS } from '../graphql/subscriptions';
import { Chat } from '../types/database';
import { Plus, MessageCircle, Clock, Menu, X } from 'lucide-react';

interface ChatSidebarProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat?: () => void;
  currentUserId: string; // ✅ required
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  selectedChatId,
  onSelectChat,
  onNewChat,
  currentUserId
}) => {
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { data: chatsData, loading } = useQuery(GET_USER_CHATS);
  const [createChat] = useMutation(CREATE_CHAT, {
    refetchQueries: [GET_USER_CHATS],
  });

  useSubscription(SUBSCRIBE_TO_CHATS, {
    onSubscriptionData: ({ client }) => {
      client.refetchQueries({
        include: [GET_USER_CHATS],
      });
    },
  });

  const handleNewChat = async () => {
    if (!currentUserId) return;
    setIsCreatingChat(true);
    try {
      const result = await createChat({
        variables: {
          user_id: currentUserId, // ✅ pass user_id
          title: `Chat ${new Date().toLocaleDateString()}`,
        },
      });
      if (result.data?.insert_chats_one) {
        onSelectChat(result.data.insert_chats_one.id);
        onNewChat?.();
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    } finally {
      setIsCreatingChat(false);
      setIsMobileOpen(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gray-50 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-white">
        <button
          onClick={handleNewChat}
          disabled={isCreatingChat}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {isCreatingChat ? 'Creating...' : 'New Chat'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-16 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2">
            {chatsData?.chats?.map((chat: Chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  onSelectChat(chat.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full p-3 mb-2 text-left rounded-lg transition-all duration-200 hover:bg-white hover:shadow-sm ${
                  selectedChatId === chat.id
                    ? 'bg-white shadow-sm border-l-4 border-blue-500'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate text-sm">{chat.title}</h3>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {formatTime(chat.updated_at)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
            {chatsData?.chats?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No chats yet</p>
                <p className="text-xs">Start a new conversation</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-lg rounded-lg p-2 border border-gray-200"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden md:block w-80 h-full">
        <SidebarContent />
      </div>

      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="w-80 h-full bg-white">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Chats</h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-full pb-16">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatSidebar;
