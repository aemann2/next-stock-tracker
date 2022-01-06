import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';

const Quote = () => {
	const [stockPrice, setStockPrice] = useState(null);
	const [stockSymbol, setStockSymbol] = useState('');
	const [error, setError] = useState(false);

	// Todo: improve error handling for this section. Check out Academind 180.
	const getStock = async (symbol: string) => {
		let res = null;
		setError(false);
		try {
			const apiRes = await axios.get(
				`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${process.env.NEXT_PUBLIC_IEX_TOKEN}`
			);
			res = apiRes.data;
		} catch (err) {
			console.log(err);
			res = null;
		} finally {
			if (res) {
				setStockPrice(res.latestPrice);
			} else {
				setStockPrice(null);
				setError(true);
			}
		}
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
			{stockPrice && <p>{stockPrice}</p>}
			{error && <p>Error: That stock does not exist </p>}
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
