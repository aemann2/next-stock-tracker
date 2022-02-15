import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import { StockPrice } from '../types/models';

import axios from 'axios';

interface IState {
	[key: number]: string;
}

const Quote = () => {
	const [stockPrices, setStockPrices] = useState<StockPrice[] | []>([]);
	const [queryLoading, setQueryLoading] = useState(false);
	const [inputValues, setInputValues] = useState<IState>({});
	const [numberOfInputs, setNumberOfInputs] = useState(1);
	const [error, setError] = useState(false);

	useEffect(() => {
		const newInputValues: IState = {};
		for (let i = 0; i < numberOfInputs; i++) {
			newInputValues[i] = inputValues[i] || '';
		}
		setInputValues(newInputValues);
		// FIX: Fix this so you don't have to use the eslint hack
		// eslint-disable-next-line
	}, [numberOfInputs]);

	// Todo: improve error handling for this section. Check out Academind 180.
	const getStockPrice = async (symbols: string[]) => {
		let res = null;
		setStockPrices([]);
		setQueryLoading(true);
		setError(false);
		try {
			const apiRes = await axios.get(
				`api/batchquote?symbols=${symbols.join(',')}`
			);
			res = apiRes.data;
		} catch (err) {
			res = null;
		} finally {
			if (res) {
				const stockResults = [];
				for (const property in res.data) {
					stockResults.push({
						name: property,
						price: res.data[property].quote.latestPrice,
					});
				}
				setStockPrices(stockResults);
			} else {
				setStockPrices([]);
				setError(true);
			}
		}
		setQueryLoading(false);
	};

	function handleSymbolInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setInputValues({
			...inputValues,
			[e.target.name]: value.toUpperCase(),
		});
	}

	const handleNumberOfInputsChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (Number(e.target.value) > 4 || Number(e.target.value) < 1) return;
		setNumberOfInputs(Number(e.target.value));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const values = Object.values(inputValues);
		await getStockPrice(values);
	};

	const inputs = [];

	for (let i = 0; i < numberOfInputs; i++) {
		inputs.push(
			<input
				key={i}
				type='text'
				name={`${i}`}
				placeholder='Enter a symbol'
				maxLength={5}
				disabled={queryLoading}
				value={inputValues[i] || ''}
				onChange={handleSymbolInputChange}
			/>
		);
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				{inputs}
				<button
					disabled={Object.values(inputValues)[0] === '' || queryLoading}
					type='submit'
				>
					Submit
				</button>
			</form>
			<div>
				<label htmlFor='numberOfInputs'>Enter Multiple</label>
				<input
					type='number'
					name='numberOfInputs'
					id='numberOfInputs'
					disabled={queryLoading}
					min={1}
					max={4}
					value={numberOfInputs}
					onChange={handleNumberOfInputsChange}
				/>
			</div>
			{stockPrices &&
				stockPrices.map((stock: StockPrice, index: number) => {
					return (
						<p key={stock.name + index}>
							{stock.name}: ${stock.price}
						</p>
					);
				})}
			{error && <p>Error: You must enter at least one valid stock symbol.</p>}
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
