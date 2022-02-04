import { gql } from '@apollo/client';

export const GET_STOCKS = gql`
	query Stocks($userId: String!) {
		stocks(userId: $userId) {
			symbol
			shares
		}
	}
`;

export const GET_TRANSACTIONS = gql`
	query Transactions($userId: String!) {
		transactions(userId: $userId) {
			symbol
			shares
			price
			transType
			transacted
		}
	}
`;

export const BUY_STOCK = gql`
	mutation BuyStock(
		$userId: String!
		$shares: Int!
		$symbol: String!
		$price: Float!
	) {
		addTransaction(
			userId: $userId
			symbol: $symbol
			shares: $shares
			price: $price
			transType: BUY
		) {
			symbol
			transType
		}
		addStock(userId: $userId, symbol: $symbol, shares: $shares) {
			id
		}
		modifyUser(id: $userId, price: $price, shares: $shares) {
			balance
		}
	}
`;

export const SELL_STOCK = gql`
	mutation SellStock(
		$userId: String!
		$shares: Int!
		$symbol: String!
		$price: Float!
	) {
		addTransaction(
			userId: $userId
			symbol: $symbol
			shares: $shares
			price: $price
			transType: SELL
		) {
			symbol
			transType
		}
		removeStock(userId: $userId, symbol: $symbol, shares: $shares) {
			id
		}
		modifyUser(id: $userId, price: $price, shares: $shares) {
			balance
		}
	}
`;

export const REMOVE_STOCK = gql`
	mutation RemoveStock(
		$userId: String!
		$shares: Int!
		$symbol: String!
		$price: Float!
	) {
		addTransaction(
			userId: $userId
			symbol: $symbol
			shares: $shares
			price: $price
			transType: SELL
		) {
			symbol
			transType
		}
		deleteStock(userId: $userId, symbol: $symbol) {
			id
		}
		modifyUser(id: $userId, price: $price, shares: $shares) {
			balance
		}
	}
`;

export const USER = gql`
	query User($id: String!) {
		user(id: $id) {
			balance
		}
	}
`;
