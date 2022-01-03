import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { gql, useQuery } from '@apollo/client';

interface IProps {
	user: {
		email: string;
	};
	userId: string;
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
	const { data, error, loading } = useQuery(STOCKS, {
		variables: { userId: props.userId },
	});
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Oops, something went wrong {error.message}</p>;
	return (
		<div>
			<p>{props.user.email}</p>
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
