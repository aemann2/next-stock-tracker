import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import { gql, useMutation } from '@apollo/client';

interface IProps {
	user: {
		email: string;
	};
	userId: string;
}

const BUY_STOCK = gql`
	mutation BuyStock(
		$userId: String!
		$shares: Int!
		$symbol: String!
		$price: Float!
	) {
		addTransaction(
			userId: $userId
			symbol: $symbol
			shares: $shares
			price: $price
			transType: BUY
		) {
			userId
		}
		addStock(userId: $userId, symbol: $symbol, shares: $shares) {
			userId
		}
		modifyUser(id: $userId, price: $price, shares: $shares) {
			id
		}
	}
`;

const Buy: React.FC<IProps> = (props) => {
	const [stockSymbol, setStockSymbol] = useState('');
	const [shares, setShares] = useState(1);
	const [buyErr, setBuyErr] = useState<String | null>(null);
	const [BuyStock, { data: data, loading: loading, error: reqErr }] =
		useMutation(BUY_STOCK);

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
				`https://cloud.iexapis.com/stable/stock/${stockSymbol}/quote?token=${process.env.NEXT_PUBLIC_IEX_TOKEN}`
			);
			stockPrice = res.data.latestPrice;
		} catch (error) {
			setBuyErr('Stock does not exist');
		}

		if (stockPrice) {
			setBuyErr(null);
			await BuyStock({
				variables: {
					userId: props.userId,
					symbol: stockSymbol,
					price: stockPrice * shares,
					shares: shares,
				},
			});
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
				<button disabled={loading} onClick={buyStock}>
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
