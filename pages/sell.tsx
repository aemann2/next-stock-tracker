import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { SELL_STOCK, USER } from '../queries';
import { useMutation, useQuery } from '@apollo/client';
import { addApolloState, initializeApollo } from '../lib/apolloClient';

interface IProps {
	user: {
		email: string;
	};
	userId: string;
}

const Sell: React.FC<IProps> = (props) => {
	const [stockSymbol, setStockSymbol] = useState('');
	const [shares, setShares] = useState(1);
	const [sellErr, setSellErr] = useState<String | null>(null);

	const [
		SellStock,
		{ data: mutationData, loading: mutationLoading, error: reqErr },
	] = useMutation(SELL_STOCK);

	const {
		loading: queryLoading,
		error: queryErr,
		data: queryData,
		refetch: refetchBalance,
	} = useQuery(USER, {
		variables: {
			id: props.userId,
		},
	});

	const handleStockSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStockSymbol(e.target.value);
	};

	const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShares(Number(e.target.value));
	};

	const handleSumit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setShares(1);
	};

	const sellStock = async () => {
		let stockPrice;

		try {
			const res = await axios.get(`api/stockquote?symbol=${stockSymbol}`);
			stockPrice = res.data.latestPrice;
		} catch (error) {
			setSellErr('Stock does not exist');
		}

		// TODO: add logic for if user doesn't have enough shares
		// if (stockPrice * shares > queryData!.user.balance) {
		// 	setSellErr('Insufficient funds');
		// 	return;
		// }

		if (stockPrice) {
			setSellErr(null);
			await SellStock({
				variables: {
					userId: props.userId,
					symbol: stockSymbol,
					price: stockPrice * shares,
					shares: shares,
				},
			});
			refetchBalance();
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
				/>
				<input
					placeholder='Shares'
					type='number'
					min='1'
					onChange={handleSharesChange}
					value={shares}
				/>
				<button disabled={mutationLoading} onClick={sellStock}>
					Sell
				</button>
			</form>
			{/* {sellErr && <p>Error: {sellErr}</p>}
			{reqErr && <p>Error: {reqErr}</p>} */}
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
		query: USER,
		variables: { id: user.userId },
	});

	return addApolloState(apolloClient, {
		props: user,
	});
};
