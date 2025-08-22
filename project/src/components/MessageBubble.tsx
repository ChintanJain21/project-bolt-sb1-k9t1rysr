import React from 'react';
import { Message } from '../types/database';
import { Bot, User, Clock, Sparkles } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isBot = message.is_bot;
  const isUser = !isBot && isCurrentUser;

  return (
    <div className={`flex items-start gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''} group`}>
      {/* Avatar */}
      <div className={`relative flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
        isBot 
          ? 'bg-gradient-to-tr from-violet-600 to-purple-700 shadow-lg shadow-purple-500/25' 
          : isUser 
            ? 'bg-gradient-to-tr from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/25' 
            : 'bg-gradient-to-tr from-gray-600 to-gray-700 shadow-lg shadow-gray-500/25'
      }`}>
        {isBot ? (
          <>
            <Bot className="w-5 h-5 text-white drop-shadow-sm" />
            <div className="absolute -inset-1 bg-gradient-to-tr from-violet-600/30 to-purple-600/30 rounded-2xl blur-lg -z-10 animate-pulse"></div>
          </>
        ) : (
          <>
            <User className="w-5 h-5 text-white drop-shadow-sm" />
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 rounded-2xl blur-lg -z-10"></div>
          </>
        )}
      </div>

      {/* Message content */}
      <div className={`flex-1 max-w-xs sm:max-w-md lg:max-w-lg ${isUser ? 'flex justify-end' : ''}`}>
        <div className={`relative rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-xl ${
          isBot
            ? 'bg-gray-800/80 border border-gray-700/50 text-gray-100 hover:bg-gray-800/90 hover:border-gray-600/50'
            : isUser
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700'
              : 'bg-gray-700/80 text-gray-100 border border-gray-600/50 hover:bg-gray-700/90'
        }`}>
          
          {/* Subtle glow effect */}
          <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
            isBot
              ? 'bg-gradient-to-r from-violet-600 to-purple-600'
              : isUser
                ? 'bg-gradient-to-r from-blue-400 to-indigo-400'
                : 'bg-gradient-to-r from-gray-500 to-gray-400'
          }`}></div>

          {/* AI Badge for bot messages */}
          {isBot && (
            <div className="flex items-center gap-1 mb-2 text-xs">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span className="text-violet-300 font-medium">AI Assistant</span>
            </div>
          )}

          <p className="text-sm leading-relaxed whitespace-pre-wrap relative z-10">
            {message.content}
          </p>
          
          <div className={`flex items-center gap-1 mt-2 text-xs relative z-10 ${
            isUser ? 'text-blue-100' : 'text-gray-400'
          }`}>
            <Clock className="w-3 h-3" />
            {formatTime(message.created_at)}
          </div>

          {/* Message status indicator for user messages */}
          {isUser && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full shadow-sm"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;