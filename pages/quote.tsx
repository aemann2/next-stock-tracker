import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import axios from 'axios';

const Quote = () => {
	const [stockPrice, setStockPrice] = useState(null);
	const [stockSymbol, setStockSymbol] = useState('');
	const [numberOfInputs, setNumberOfInputs] = useState(1);
	const [error, setError] = useState(false);

	// Todo: improve error handling for this section. Check out Academind 180.
	const getStockPrice = async (symbol: string) => {
		let res = null;
		setError(false);
		try {
			const apiRes = await axios.get(`api/stockquote?symbol=${symbol}`);
			res = apiRes.data;
		} catch (err) {
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

	const handleSymbolInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStockSymbol(e.target.value);
	};

	const handleNumberOfInputsChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (Number(e.target.value) > 4 || Number(e.target.value) < 1) return;
		setNumberOfInputs(Number(e.target.value));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		getStockPrice(stockSymbol);
	};

	const inputs = [];

	for (let i = 0; i < numberOfInputs; i++) {
		inputs.push(
			<input
				type='text'
				name={`stock${i}`}
				placeholder='Enter a symbol'
				value={stockSymbol}
				onChange={handleSymbolInputChange}
			/>
		);
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				{inputs}
				<button type='submit'>Submit</button>
			</form>
			<div>
				<label htmlFor='numberOfInputs'>Enter Multiple</label>
				<input
					type='number'
					name='numberOfInputs'
					id='numberOfInputs'
					min={1}
					max={4}
					value={numberOfInputs}
					onChange={handleNumberOfInputsChange}
				/>
			</div>
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
