import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.monday.com/v2/',
  headers: {
    Authorization: import.meta.env.VITE_MONDAY_API_KEY || '',
    'API-Version': '2023-10',
    'Content-Type': 'application/json',
  },
  cache: new InMemoryCache(),
});

export const MondayApiProvider = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
