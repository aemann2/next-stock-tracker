import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apolloClient';
import { SessionProvider } from 'next-auth/react';

import store from '../store';
import { Provider } from 'react-redux';

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
	const apolloClient = useApollo(pageProps);

	return (
		<Provider store={store}>
			<ApolloProvider client={apolloClient}>
				<SessionProvider session={session}>
					<Component {...pageProps} />
				</SessionProvider>
			</ApolloProvider>
		</Provider>
	);
};

export default App;
