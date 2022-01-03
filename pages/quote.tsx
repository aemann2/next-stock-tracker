import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';

const Quote = () => {
	const [stockPrice, setStockPrice] = useState(null);
	const [stockSymbol, setStockSymbol] = useState('');

	const getStock = async (symbol: string) => {
		const res = await axios.get(
			`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${process.env.IEX_TOKEN}`
		);
		console.log(res);
		setStockPrice(res.data.latestPrice);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStockSymbol(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		getStock(stockSymbol);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					name='stock'
					placeholder='Enter a symbol'
					value={stockSymbol}
					onChange={handleChange}
				/>
				<button type='submit'>Submit</button>
			</form>
			{stockPrice}
		</div>
	);
};

export default Quote;

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
