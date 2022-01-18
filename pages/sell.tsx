import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { gql, useMutation } from '@apollo/client';

interface IProps {
	user: {
		email: string;
	};
	userId: string;
}

const SELL_STOCK = gql`
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

const Buy: React.FC<IProps> = (props) => {
	const [SellStock, { data: data, loading: loading, error: error }] =
		useMutation(SELL_STOCK);

	const sellStock = async () => {
		await SellStock({
			variables: { userId: props.userId, symbol: 'TEST', shares: 1 },
		});
	};

	return (
		<div>
			<p>{props.user.email}</p>
			<button onClick={sellStock}>Sell</button>
		</div>
	);
};

export default Buy;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	const data = session!;
	if (!session) {
		return {
			redirect: {
				destination: '/api/auth/signin',
				permanent: false,
			},
		};
	}
	return {
		props: data,
	};
};
