import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { GET_STOCKS, USER } from '../queries';
import { Stock, StockQueryData } from '../types/models';

import { useQuery } from '@apollo/client';
import axios from 'axios';
import { addApolloState, initializeApollo } from '../lib/apolloClient';

interface IProps {
	id: string;
	balance: number;
	email: string;
	stockApiData: StockQueryData;
}

const Home: React.FC<IProps> = (props) => {
	const { id, balance, email, stockApiData } = props;
	const { loading, error, data } = useQuery(GET_STOCKS, {
		variables: {
			userId: id,
		},
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Oops, something went wrong {error.message}</p>;

	return (
		<div>
			<p>{email}</p>
			{data.stocks.map((stock: Stock) => (
				<div key={stock.symbol}>
					<p>
						{stock.symbol} | {stock.shares} |{' '}
						{stockApiData[stock.symbol].quote.companyName} | $
						{stockApiData[stock.symbol].quote.latestPrice.toFixed(2)} | $
						{(
							stock.shares * stockApiData[stock.symbol].quote.latestPrice
						).toFixed(2)}
					</p>
				</div>
			))}
			<p>Balance: ${balance}</p>
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

	const userStockData = await apolloClient.query({
		query: GET_STOCKS,
		variables: { userId: user.userId },
	});

	const userData = await apolloClient.query({
		query: USER,
		variables: { id: user.userId },
	});

	const stockSymbols = userStockData.data.stocks.map(
		(stock: Stock) => stock.symbol
	);

	const stockApiData = await axios.get(
		`https://cloud.iexapis.com/v1/stock/market/batch?&types=quote&symbols=${stockSymbols}&token=${process.env.NEXT_PUBLIC_IEX_TOKEN}`
	);

	return addApolloState(apolloClient, {
		props: {
			id: user.userId,
			balance: userData.data.user.balance,
			email: user.user.email,
			stockApiData: stockApiData.data,
		},
	});
};
