import '../styles/globals.css';
import type { AppProps } from 'next/app';
import NavLayout from '../layouts/NavLayout';

import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apolloClient';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import store from '../store';
import { Provider } from 'react-redux';

const theme = createTheme({
	typography:{
    fontFamily: [
		'-apple-system', 
		'BlinkMacSystemFont', 
		'Segoe UI', 
		'Roboto', 
		'Oxygen',
		'Ubuntu', 
		'Cantarell', 
		'Fira Sans', 
		'Droid Sans', 
		'Helvetica Neue', 
		'sans-serif'
    ].join(','),
	},
  palette: {
    primary: {
      main: '#080732',
			contrastText: indigo[50],
    },
		secondary: {
			main: indigo[800],
		},
		warning: {
			main: '#b44b50'
		}
  },
});

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
	const apolloClient = useApollo(pageProps);

	return (
	<ThemeProvider theme={theme}>
		<Provider store={store}>
			<ApolloProvider client={apolloClient}>
				<SessionProvider session={session}>
					<NavLayout>
						<Component 
						{...pageProps} 
						/>
					</NavLayout>
				</SessionProvider>
			</ApolloProvider>
		</Provider>
	</ThemeProvider>
	);
};

export default App;
