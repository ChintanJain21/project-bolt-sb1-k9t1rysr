import React from 'react';
import { Message } from '../types/database';
import { Bot, User, Clock } from 'lucide-react';

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
    <div className={`flex items-start gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isBot ? 'bg-purple-100' : isUser ? 'bg-blue-100' : 'bg-gray-100'
      }`}>
        {isBot ? (
          <Bot className="w-4 h-4 text-purple-600" />
        ) : (
          <User className="w-4 h-4 text-blue-600" />
        )}
      </div>

      {/* Message content */}
      <div className={`flex-1 max-w-xs sm:max-w-md lg:max-w-lg ${isUser ? 'flex justify-end' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isBot
            ? 'bg-white border border-gray-200'
            : isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          
          <div className={`flex items-center gap-1 mt-2 text-xs ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <Clock className="w-3 h-3" />
            {formatTime(message.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;