import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { SELL_STOCK, REMOVE_STOCK, GET_STOCKS } from '../queries';
import { Stock } from '../types/models';

import { useMutation, useQuery } from '@apollo/client';
import { addApolloState, initializeApollo } from '../lib/apolloClient';
import axios from 'axios';

interface IProps {
	user: {
		email: string;
	};
	userId: string;
}

const Sell: React.FC<IProps> = (props) => {
	const [stockSymbol, setStockSymbol] = useState<string>();
	const [sharesToSell, setSharesToSell] = useState(1);
	const [transactionLoading, setTransactionLoading] = useState(false);
	const [sellErr, setSellErr] = useState<String | null>(null);

	const [
		SellStock,
		{
			data: sellMutationData,
			loading: sellMutationLoading,
			error: sellMutationErr,
		},
	] = useMutation(SELL_STOCK);

	const [
		RemoveStock,
		{
			data: removeMutationData,
			loading: removeMutationLoading,
			error: removeMutationErr,
		},
	] = useMutation(REMOVE_STOCK);

	const {
		loading: queryLoading,
		error: queryErr,
		data: queryData,
		refetch: refetchStocks,
	} = useQuery(GET_STOCKS, {
		variables: {
			userId: props.userId,
		},
	});

	useEffect(() => {
		if (queryData) {
			setStockSymbol(queryData.stocks[0].symbol);
		}
	}, [queryData]);

	const handleStockSymbolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setStockSymbol(e.target.value);
	};

	const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSharesToSell(Number(e.target.value));
	};

	const handleSumit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSharesToSell(1);
	};

	const sellStock = async () => {
		setTransactionLoading(true);
		let stockPrice;

		const res = await axios.get(`api/stockquote?symbol=${stockSymbol}`);
		stockPrice = res.data.latestPrice;

		const userStockData = queryData.stocks.find(
			(stock: Stock) => stock.symbol === stockSymbol
		);

		if (sharesToSell > userStockData.shares) {
			setSellErr("You don't own enough stock");
			setTransactionLoading(false);
			return;
		}

		if (stockPrice && sharesToSell === userStockData.shares) {
			setSellErr(null);
			await RemoveStock({
				variables: {
					userId: props.userId,
					symbol: stockSymbol,
					price: stockPrice * sharesToSell,
					shares: sharesToSell,
				},
			});
			refetchStocks();
			setTransactionLoading(false);
			return;
		}

		if (stockPrice) {
			setSellErr(null);
			await SellStock({
				variables: {
					userId: props.userId,
					symbol: stockSymbol,
					price: stockPrice * sharesToSell,
					shares: sharesToSell,
				},
			});
			refetchStocks();
			setTransactionLoading(false);
		}
	};

	return (
		<div>
			<p>{props.user.email}</p>
			<form onSubmit={handleSumit}>
				<select
					name='stocks'
					value={stockSymbol || queryData.stocks[0]}
					onChange={handleStockSymbolChange}
					disabled={transactionLoading}
				>
					{queryData.stocks.map((stock: Stock) => {
						return (
							<option key={stock.symbol} value={stock.symbol}>
								{stock.symbol} : {stock.shares}
							</option>
						);
					})}
				</select>
				<input
					placeholder='Shares'
					type='number'
					min='1'
					onChange={handleSharesChange}
					value={sharesToSell}
					disabled={transactionLoading}
				/>
				<button disabled={transactionLoading} onClick={sellStock}>
					Sell
				</button>
			</form>
			{sellErr && <p>Error: {sellErr}</p>}
		</div>
	);
};

export default Sell;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	const user = session!;
	const apolloClient = initializeApollo();

	if (!session) {
		return {
			redirect: {
				destination: '/api/auth/signin',
				permanent: false,
			},
		};
	}

	await apolloClient.query({
		query: GET_STOCKS,
		variables: { userId: user.userId },
	});

	return addApolloState(apolloClient, {
		props: user,
	});
};
