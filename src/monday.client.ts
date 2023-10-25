import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'https://api.monday.com/v2/',
  headers: {
    Authorization: import.meta.env.VITE_MONDAY_API_KEY || '',
    'API-Version': '2023-07',
    'Content-Type': 'application/json',
  },
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql`
      query {
        boards(ids: [1287143776]) {
          id
          name

          activity_logs(column_ids: ["status0"], from: "2023-10-07", limit: 100) {
            data
            created_at
          }
        }
      }
    `,
  })
  .then((result) => console.log(result));
