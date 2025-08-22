import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { INSERT_USER_MESSAGE, SEND_MESSAGE } from '../graphql/mutations';
import { Send, Loader2, AlertCircle, Sparkles } from 'lucide-react';

interface MessageInputProps {
  chatId: string | null;
  currentUserId: string;
  onMessageSent?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId, currentUserId, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [insertUserMessage] = useMutation(INSERT_USER_MESSAGE);
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chatId || !currentUserId || isLoading) return;

    const messageContent = message.trim();
    setMessage('');
    setError(null);
    setIsLoading(true);

    try {
      // Insert user message
      await insertUserMessage({
        variables: {
          chatId: String(chatId),
          user_id: String(currentUserId),
          content: String(messageContent),
        },
      });

      // Trigger bot response
      const result = await sendMessage({
        variables: {
          chat_id: String(chatId),
          content: String(messageContent),
        },
      });

      if (result.data?.sendMessage?.error) {
        setError(result.data.sendMessage.error);
      } else if (!result.data?.sendMessage?.success) {
        setError('Failed to send message to AI');
      }

      onMessageSent?.();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  if (!chatId) {
    return (
      <div className="p-4 border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="text-center text-gray-400 text-sm flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Select a chat to start messaging with AI</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
      {error && (
        <div className="mb-3 p-3 bg-red-900/40 border border-red-700/50 rounded-xl flex items-center gap-2 backdrop-blur-sm">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-200 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300 transition-colors"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask AI anything..."
            disabled={isLoading}
            rows={1}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-2xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 focus:bg-gray-700/70 resize-none transition-all duration-300 disabled:bg-gray-800/50 disabled:cursor-not-allowed placeholder-gray-400 text-white backdrop-blur-sm"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          {/* Gradient overlay on focus */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600/0 via-purple-600/0 to-violet-600/0 opacity-0 focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
        </div>

        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="relative flex-shrink-0 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white p-3 rounded-2xl transition-all duration-300 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin relative z-10" />
          ) : (
            <Send className="w-5 h-5 relative z-10" />
          )}
        </button>
      </form>

      {isLoading && (
        <div className="flex items-center gap-3 mt-3 text-sm text-gray-400">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            <span>AI is thinking...</span>
          </div>
        </div>
      )}

      {/* Subtle hint */}
      <div className="flex items-center justify-center mt-2 text-xs text-gray-600">
        <span>Press Enter to send • Shift + Enter for new line</span>
      </div>
    </div>
  );
};

export default MessageInput;