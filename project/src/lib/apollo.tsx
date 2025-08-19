import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { nhost } from './nhost';

// HTTP link (queries & mutations)
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_NHOST_GRAPHQL_URL,
  fetch: async (uri, options) => {
    const token = await nhost.auth.getAccessToken();
    if (options?.headers) {
      options.headers = {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : '',
      };
    }
    return fetch(uri, options);
  },
});

// WebSocket link (subscriptions)
let wsClient = createClient({
  url: import.meta.env.VITE_NHOST_WS_URL,
  connectionParams: async () => {
    const token = await nhost.auth.getAccessToken();
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  },
});

const wsLink = new GraphQLWsLink(wsClient);

// Reconnect WS when token changes
nhost.auth.onTokenChanged(() => {
  try {
    wsClient.dispose();
    wsClient = createClient({
      url: import.meta.env.VITE_NHOST_WS_URL,
      connectionParams: async () => {
        const token = await nhost.auth.getAccessToken();
        return {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        };
      },
    });
  } catch (err) {
    console.error('WS dispose error:', err);
  }
});

// Split link for queries/mutations vs subscriptions
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
