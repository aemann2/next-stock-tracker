import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { GET_STOCKS } from '../queries';
import { useQuery } from '@apollo/client';
import axios from 'axios';
import { addApolloState, initializeApollo } from '../lib/apolloClient';

interface IProps {
	email: string;
	id: string;
	userStockData: any;
	stockApiData: any;
}

interface stock {
	symbol: string;
	shares: number;
}

interface stockQueryData {
	current:
		| {
				[stocks: string]: {
					quote: {
						companyName: string;
					};
				};
		  }
		| undefined;
}

const Home: React.FC<IProps> = (props) => {
	const { email, id, stockApiData } = props;
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
			{data.stocks.map((stock: stock, index: number) => (
				<div key={index}>
					<p>
						{stock.symbol} | {stock.shares} |{' '}
						{stockApiData[stock.symbol].quote.companyName} |{' '}
						{stockApiData[stock.symbol].quote.latestPrice} | $
						{(
							stock.shares * stockApiData[stock.symbol].quote.latestPrice
						).toFixed(2)}
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

	const userStockData = await apolloClient.query({
		query: GET_STOCKS,
		variables: { userId: user.userId },
	});

	const stockSymbols = userStockData.data.stocks.map(
		(stock: stock) => stock.symbol
	);

	const stockApiData = await axios.get(
		`https://cloud.iexapis.com/v1/stock/market/batch?&types=quote&symbols=${stockSymbols}&token=${process.env.NEXT_PUBLIC_IEX_TOKEN}`
	);

	return addApolloState(apolloClient, {
		props: {
			id: user.userId,
			email: user.user.email,
			stockApiData: stockApiData.data,
		},
	});
};
