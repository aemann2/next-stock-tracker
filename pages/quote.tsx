import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import axios from 'axios';

interface IState {
	[key: number]: string;
}

const Quote = () => {
	const [stockPrices, setStockPrices] = useState<any>([]);
	const [inputValues, setInputValues] = useState<IState>({});
	const [numberOfInputs, setNumberOfInputs] = useState(1);
	const [error, setError] = useState(false);

	useEffect(() => {
		const newInputValues: IState = {};
		for (let i = 0; i < numberOfInputs; i++) {
			newInputValues[i] = inputValues[i] || '';
		}
		setInputValues(newInputValues);
	}, [numberOfInputs]);

	// Todo: improve error handling for this section. Check out Academind 180.
	const getStockPrice = async (symbols: string[]) => {
		let res = null;
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
				for (const property in res.data) {
					setStockPrices([
						...stockPrices,
						{
							name: property,
							price: res.data[property].quote.latestPrice,
						},
					]);
				}
			} else {
				setStockPrices([]);
				setError(true);
			}
		}
	};

	console.log(stockPrices);

	function handleSymbolInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setInputValues({
			...inputValues,
			[e.target.name]: value,
		});
	}

	const handleNumberOfInputsChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (Number(e.target.value) > 4 || Number(e.target.value) < 1) return;
		setNumberOfInputs(Number(e.target.value));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const values = Object.values(inputValues);
		getStockPrice(values);
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
				value={inputValues[i] || ''}
				onChange={handleSymbolInputChange}
			/>
		);
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				{inputs}
				<button disabled={Object.values(inputValues)[0] === ''} type='submit'>
					Submit
				</button>
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
			{stockPrices &&
				stockPrices.map((stock: any, index: any) => {
					return (
						<p key={index}>
							{stock.name}: ${stock.price}
						</p>
					);
				})}
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
