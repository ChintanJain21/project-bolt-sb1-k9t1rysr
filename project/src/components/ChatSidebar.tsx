import React, { useState } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { GET_USER_CHATS } from '../graphql/queries';
import { CREATE_CHAT } from '../graphql/mutations';
import { SUBSCRIBE_TO_CHATS } from '../graphql/subscriptions';
import { Chat } from '../types/database';
import { Plus, MessageCircle, Clock, Menu, X, Sparkles } from 'lucide-react';
import  {LogOut} from'lucide-react'
interface ChatSidebarProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat?: () => void;
  currentUserId: string;
   handleSignOut: () => void; 
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  selectedChatId,
  onSelectChat,
  onNewChat,
  currentUserId,
  handleSignOut
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
          user_id: currentUserId,
          title: `AI Chat ${new Date().toLocaleDateString()}`,
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
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700">
      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
        <button
          onClick={handleNewChat}
          disabled={isCreatingChat}
          className="relative w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] shadow-lg hover:shadow-xl hover:shadow-purple-500/25 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Plus className="w-4 h-4 relative z-10" />
          <span className="relative z-10">{isCreatingChat ? 'Creating...' : 'New Chat'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-700/50 h-16 rounded-xl"></div>
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
                className={`w-full p-3 mb-2 text-left rounded-xl transition-all duration-300 hover:bg-gray-700/50 hover:scale-[1.02] group ${
                  selectedChatId === chat.id
                    ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 shadow-lg shadow-violet-500/10'
                    : 'hover:bg-gray-700/30 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 transition-all duration-300 ${
                    selectedChatId === chat.id
                      ? 'bg-gradient-to-tr from-violet-600 to-purple-600 shadow-lg'
                      : 'bg-gray-700 group-hover:bg-gray-600'
                  }`}>
                    <MessageCircle className={`w-4 h-4 ${
                      selectedChatId === chat.id ? 'text-white' : 'text-gray-300'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate text-sm transition-colors duration-300 ${
                      selectedChatId === chat.id ? 'text-white' : 'text-gray-200 group-hover:text-white'
                    }`}>
                      {chat.title}
                    </h3>
                    <div className={`flex items-center gap-1 mt-1 text-xs transition-colors duration-300 ${
                      selectedChatId === chat.id ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {formatTime(chat.updated_at)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
            {chatsData?.chats?.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <div className="relative mb-4">
                  <MessageCircle className="w-12 h-12 mx-auto text-gray-600" />
                  <div className="absolute -inset-2 bg-gradient-to-tr from-gray-600/10 to-gray-500/10 rounded-full blur-xl -z-10"></div>
                </div>
                <p className="text-sm text-gray-300 mb-1">No chats yet</p>
                <p className="text-xs text-gray-500">Start a new conversation with AI</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 bg-gray-900">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="relative">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
          </div>
          <span>AI Assistant Online</span>
        </div>
        {/* Just Sign Out Button */}
    <button
      onClick={handleSignOut}
      className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg px-3 py-2 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span className="text-sm">Sign Out</span>
    </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-lg p-2 border border-gray-700 hover:bg-gray-700/90 transition-all duration-300"
      >
        <Menu className="w-5 h-5 text-gray-300" />
      </button>

      <div className="hidden md:block w-80 h-full">
        <SidebarContent />
      </div>

      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
          <div className="w-80 h-full bg-gray-900 shadow-2xl">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <h2 className="font-semibold text-white">AI Chats</h2>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
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

      <style >{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(75 85 99);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(107 114 128);
        }
      `}</style>
    </>
  );
};

export default ChatSidebar;
