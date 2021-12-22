import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
	type User {
		id: String
		name: String
		email: String
		image: String
		balance: Float
		# stocks: [Stock]
		# transactions: [Transaction]
	}

	type Stock {
		userId: String
		symbol: String
		shares: Int
		user: User
	}

	type Transaction {
		userId: String
		symbol: String
		shares: Int
		price: Float
		transType: transType
		transacted: String
		user: User
	}

	enum transType {
		BUY
		SELL
	}

	type Query {
		user(email: String): User
		users: [User]
	}
`;
