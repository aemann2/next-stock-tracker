import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../lib/apollo';
import { SessionProvider } from 'next-auth/react';

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
	return (
		<ApolloProvider client={apolloClient}>
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>
		</ApolloProvider>
	);
};

export default App;
