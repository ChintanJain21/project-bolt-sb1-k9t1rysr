import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { INSERT_USER_MESSAGE, SEND_MESSAGE } from '../graphql/mutations';
import { Send, Loader2, AlertCircle } from 'lucide-react';

interface MessageInputProps {
  chatId: string | null;
  currentUserId: string; // ✅ required
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
      // Insert user message - ensure all values are properly typed
      await insertUserMessage({
        variables: {
          chatId: String(chatId), // ✅ Ensure chatId is a string
          user_id: String(currentUserId), // ✅ Ensure user_id is a string
          content: String(messageContent), // ✅ Ensure content is a string
        },
      });

      // Trigger bot response - ensure chat_id is a string
      const result = await sendMessage({
        variables: {
          chat_id: String(chatId), // ✅ Ensure chat_id is a string
          content: String(messageContent), // ✅ Ensure content is a string
        },
      });

      if (result.data?.sendMessage?.error) {
        setError(result.data.sendMessage.error);
      } else if (!result.data?.sendMessage?.success) {
        setError('Failed to send message to bot');
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
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center text-gray-500 text-sm">
          Select a chat to start messaging
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            rows={1}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>

      {isLoading && (
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span>Bot is typing...</span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;