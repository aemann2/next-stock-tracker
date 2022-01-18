import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { gql, useQuery } from '@apollo/client';
import { addApolloState, initializeApollo } from '../lib/apolloClient';

interface IProps {
	email: string;
	id: string;
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

const Home: React.FC<IProps> = (props) => {
	const { email, id } = props;
	const { loading, error, data } = useQuery(STOCKS, {
		variables: {
			userId: id,
		},
	});
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Oops, something went wrong {error.message}</p>;
	return (
		<div>
			<p>{email}</p>
			{data.stocks.map((stock: stock, index: number) => (
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
	const apolloClient = initializeApollo();
	const user = session!;

	if (!session) {
		return {
			redirect: {
				destination: '/api/auth/signin',
				permanent: false,
			},
		};
	}

	await apolloClient.query({
		query: STOCKS,
		variables: { userId: user.userId },
	});

	return addApolloState(apolloClient, {
		props: {
			id: user.userId,
			email: user.user.email,
		},
	});
};
