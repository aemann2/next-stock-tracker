import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import { BUY_STOCK, USER } from '../queries';
import { useMutation, useQuery } from '@apollo/client';
import { addApolloState, initializeApollo } from '../lib/apolloClient';

interface IProps {
	user: {
		email: string;
	};
	userId: string;
}

const Buy: React.FC<IProps> = (props) => {
	const [stockSymbol, setStockSymbol] = useState('');
	const [shares, setShares] = useState(1);
	const [buyErr, setBuyErr] = useState<String | null>(null);

	const [
		BuyStock,
		{ data: mutationData, loading: mutationLoading, error: reqErr },
	] = useMutation(BUY_STOCK);

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

	const buyStock = async () => {
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
		}

		if (stockPrice * shares > queryData!.user.balance) {
			setBuyErr('Insufficient funds');
			return;
		}

		if (stockPrice) {
			setBuyErr(null);
			await BuyStock({
				variables: {
					userId: props.userId,
					symbol: stockSymbol,
					price: -1 * (stockPrice * shares),
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
				<button disabled={mutationLoading} onClick={buyStock}>
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
