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
			userId
		}
		addStock(userId: $userId, symbol: $symbol, shares: $shares) {
			userId
		}
		modifyUser(id: $userId, price: $price, shares: $shares) {
			id
		}
	}
`;

export const SELL_STOCK = gql`
	mutation SellStock($userId: String!, $shares: Int!, $symbol: String!) {
		addTransaction(
			userId: $userId
			symbol: $symbol
			shares: $shares
			price: 48.39
			transType: SELL
		) {
			userId
		}
		modifyUser(id: $userId, balance: 10430.23) {
			id
		}
		modifyStock(userId: $userId, symbol: $symbol, shares: $shares) {
			userId
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