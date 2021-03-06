import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
	type User {
		id: String
		name: String
		email: String
		image: String
		balance: Float
	}

	type Stock {
		id: String
		userId: String
		symbol: String
		shares: Int
		userStockId: userStockId
	}

	type Transaction {
		userId: String
		symbol: String
		shares: Int
		price: Float
		transType: transType
		transacted: String
	}

	enum transType {
		BUY
		SELL
	}

	type userStockId {
		userId: String
		shares: String
	}

	type Query {
		user(id: String): User
		users: [User]
		stocks(userId: String): [Stock]
		stock(userId: String, symbol: String): [Stock]
		transactions(userId: String): [Transaction]
	}

	type Mutation {
		addStock(userId: String!, symbol: String!, shares: Int!): Stock

		addTransaction(
			userId: String!
			symbol: String!
			shares: Int!
			price: Float!
			transType: transType!
			transacted: String
		): Transaction

		removeStock(userId: String!, symbol: String!, shares: Int!): Stock

		modifyUser(id: String!, price: Float!, shares: Int!): User

		deleteStock(userId: String!, symbol: String!): Stock
	}
`;
