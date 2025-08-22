import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NhostProvider } from '@nhost/react';
import { ApolloProvider } from '@apollo/client';
import { useAuthenticationStatus, useSignOut, useUserData } from '@nhost/react';
import { nhost } from './lib/nhost';
import { apolloClient } from './lib/apollo';
import LoginPage from './components/LoginPage';
import ChatSidebar from './components/ChatSidebar';
import ChatArea from './components/ChatArea';


const AppContent: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuthenticationStatus();
  const { signOut } = useSignOut();
  const user = useUserData();

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
    setSelectedChatId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const currentUserId = user?.id;
  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Error: User data not available.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Header / User info */}
      <div className="fixed top-0 right-0 z-40 p-4">
       
      </div>

      {/* Main content */}
      <div className="flex-1 flex pt-16 md:pt-0">
        <ChatSidebar
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          onNewChat={() => {}}
          currentUserId={currentUserId} // ✅ Pass user_id
          handleSignOut={handleSignOut}
        />
        <div className="flex-1 md:ml-0 ml-0">
          <ChatArea
            chatId={selectedChatId}
            currentUserId={currentUserId} // ✅ Pass user_id for messages
          />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={apolloClient}>
        <Router>
          <AppContent />
        </Router>
      </ApolloProvider>
    </NhostProvider>
  );
};

export default App;
