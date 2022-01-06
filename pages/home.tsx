import React from 'react';
import { GetServerSideProps } from 'next';
import client from '../lib/apollo';
import { getSession } from 'next-auth/react';
import { gql } from '@apollo/client';

interface IProps {
	stocks: stock[];
}

interface stock {
	symbol: string;
	shares: number;
}

const STOCKS = gql`
	query Stocks($userId: String!) {
		stocks(userId: $userId) {
			symbol
			shares
		}
	}
`;

const Home: React.FC<IProps> = ({ stocks }) => {
	return (
		<div>
			{stocks.map((stock: stock, index: number) => (
				<div key={index}>
					<p>
						{stock.symbol}, {stock.shares}
					</p>
				</div>
			))}
		</div>
	);
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	const userId = session!.userId;

	const { data } = await client.query({
		query: STOCKS,
		variables: {
			userId,
		},
	});

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
