import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
// import apolloClient from '../lib/apollo';
import { useApollo } from '../lib/apolloClient';
import { SessionProvider } from 'next-auth/react';

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
	const apolloClient = useApollo(pageProps);

	return (
		<ApolloProvider client={apolloClient}>
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>
		</ApolloProvider>
	);
};

export default App;
