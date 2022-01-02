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

// I should use upsert here in case the user already has a stock

const BUY_STOCK = gql`
	mutation BuyStock($userId: String!, $shares: Int!, $symbol: String!) {
		addTransaction(
			userId: $userId
			symbol: $symbol
			shares: $shares
			price: 48.39
			transType: BUY
		) {
			userId
		}
		addStock(userId: $userId, symbol: $symbol, shares: $shares) {
			userId
		}
		modifyUser(id: $userId, balance: 9938.23) {
			userId
		}
	}
`;

const Buy: React.FC<IProps> = (props) => {
	const [BuyStock, { data: data2, loading: loading2, error: error2 }] =
		useMutation(BUY_STOCK, {
			variables: { userId: props.userId, symbol: 'TEST', shares: 99 },
		});
	BuyStock({
		variables: { userId: props.userId, symbol: 'TEST', shares: 99 },
	});
	return (
		<div>
			<p>{props.user.email}</p>
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
