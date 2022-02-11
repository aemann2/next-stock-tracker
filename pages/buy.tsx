import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { BUY_STOCK, USER } from '../queries';

import { useMutation, useQuery } from '@apollo/client';
import { addApolloState, initializeApollo } from '../lib/apolloClient';
import axios from 'axios';

interface IProps {
	user: {
		email: string;
	};
	userId: string;
}

const Buy: React.FC<IProps> = (props) => {
	const [stockSymbol, setStockSymbol] = useState('');
	const [shares, setShares] = useState(1);
	const [transactionLoading, setTransactionLoading] = useState(false);
	const [buyErr, setBuyErr] = useState<String | null>(null);
	const [userBalance, setUserBalance] = useState(null);

	const [
		BuyStock,
		{ data: mutationData, loading: mutationLoading, error: reqErr },
	] = useMutation(BUY_STOCK);

	const {
		loading: queryLoading,
		error: queryErr,
		data: queryData,
	} = useQuery(USER, {
		variables: {
			id: props.userId,
		},
	});

	useEffect(() => {
		setUserBalance(queryData?.user.balance);
	}, [queryData?.user.balance]);

	const handleStockSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStockSymbol(e.target.value);
	};

	const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) === 0) {
			setShares(1);
			return;
		}
		setShares(Number(e.target.value));
	};

	const handleSumit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setShares(1);
	};

	const buyStock = async () => {
		setTransactionLoading(true);
		let stockPrice;

		try {
			const res = await axios.get(
				`https://cloud.iexapis.com/stable/stock/${stockSymbol.toUpperCase()}/quote?token=${
					process.env.NEXT_PUBLIC_IEX_TOKEN
				}`
			);
			stockPrice = res.data.latestPrice;
		} catch (error) {
			setBuyErr('Stock does not exist');
			setTransactionLoading(false);
		}

		if (stockPrice * shares > userBalance!) {
			setBuyErr('Insufficient funds');
			setTransactionLoading(false);
			return;
		}

		if (stockPrice) {
			setBuyErr(null);
			const { data } = await BuyStock({
				variables: {
					userId: props.userId,
					symbol: stockSymbol,
					price: -1 * (stockPrice * shares),
					shares: shares,
				},
			});
			setUserBalance(data.modifyUser.balance);
			setTransactionLoading(false);
		}
	};

	return (
		<div>
			<p>{props.user.email}</p>
			<form onSubmit={handleSumit}>
				<input
					placeholder='Symbol'
					onChange={handleStockSymbolChange}
					value={stockSymbol}
					disabled={transactionLoading}
				/>
				<input
					placeholder='Shares'
					type='number'
					min='1'
					onChange={handleSharesChange}
					value={shares}
					disabled={transactionLoading}
				/>
				<button disabled={transactionLoading} onClick={buyStock}>
					Buy
				</button>
			</form>
			{buyErr && <p>Error: {buyErr}</p>}
			{reqErr && <p>Error: {reqErr}</p>}
		</div>
	);
};

export default Buy;

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
		query: USER,
		variables: { id: user.userId },
	});

	return addApolloState(apolloClient, {
		props: user,
	});
};
