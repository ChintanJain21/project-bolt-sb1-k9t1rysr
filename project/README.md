# React Chatbot with Nhost Auth and GraphQL

A production-ready React chatbot application built with Nhost authentication, GraphQL subscriptions, and real-time messaging capabilities.

## Features

- **Authentication**: Email-based sign-in/sign-up with Nhost Auth
- **Real-time Messaging**: GraphQL subscriptions for live chat updates
- **Chat Management**: Create, view, and manage multiple chat conversations
- **Bot Integration**: Hasura actions for bot responses via n8n
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **TypeScript**: Full type safety with database models
- **Security**: Row-level security for user data isolation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Nhost project setup with GraphQL API
- Hasura actions configured for bot responses

### Environment Variables

Copy `.env.example` to `.env` and update with your Nhost project URLs:

```bash
VITE_NHOST_BACKEND_URL=https://your-app.nhost.run
VITE_NHOST_GRAPHQL_URL=https://your-app.nhost.run/v1/graphql
VITE_NHOST_WS_URL=wss://your-app.nhost.run/v1/graphql
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Database Schema

### Chats Table
```sql
CREATE TABLE chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  content text NOT NULL,
  is_bot boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

## GraphQL Operations

### Queries
- `GetUserChats`: Fetch user's chats ordered by update time
- `GetChatMessages`: Fetch messages for a specific chat

### Mutations
- `CreateChat`: Create a new chat conversation
- `InsertUserMessage`: Insert user message into chat
- `SendMessage`: Hasura action to trigger bot response

### Subscriptions
- `SubscribeToMessages`: Real-time message updates
- `SubscribeToChats`: Real-time chat list updates

## Component Architecture

- `App.tsx`: Main app with providers and routing
- `LoginPage.tsx`: Authentication interface
- `ChatSidebar.tsx`: Chat list and navigation
- `ChatArea.tsx`: Message display and real-time updates
- `MessageBubble.tsx`: Individual message styling
- `MessageInput.tsx`: Message composition and sending

## Security

- Nhost authentication for all requests
- Row-level security policies for data access
- User isolation for chats and messages
- No direct API calls from frontend

## Deployment

Build for production:
```bash
npm run build
```

The app is ready to deploy to any static hosting platform like Vercel, Netlify, or similar.