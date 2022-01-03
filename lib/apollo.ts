import { ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
	uri: 'https://next-stock-tracker.vercel.app/api/graphql',
	cache: new InMemoryCache(),
});

export default apolloClient;
