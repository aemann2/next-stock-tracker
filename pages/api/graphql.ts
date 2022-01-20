import { ApolloServer } from 'apollo-server-micro';
import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { typeDefs } from '../../graphql/schema';
import { resolvers } from '../../graphql/resolvers';
import { createContext } from '../../graphql/context';
import Cors from 'micro-cors';

// This is where the endpoint for our GQL server lives

// gets us around cors errors
const cors = Cors();

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	introspection: process.env.NODE_ENV !== 'production',
	plugins:
		process.env.NODE_ENV === 'production'
			? [ApolloServerPluginLandingPageDisabled()]
			: undefined,
	context: createContext,
});

// starts the apollo server
const startServer = apolloServer.start();

export default cors(async function handler(req, res) {
	if (req.method === 'OPTIONS') {
		res.end();
		return false;
	}
	await startServer;
	await apolloServer.createHandler({
		path: '/api/graphql',
	})(req, res);
});

export const config = {
	api: {
		bodyParser: false,
	},
};
