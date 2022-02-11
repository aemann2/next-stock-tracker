import axios from 'axios';
import { getSession } from 'next-auth/react';
import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
	const session = await getSession({ req });
	if (session) {
		const symbol = req.query.symbol;
		const apiRes = await axios.get(
			`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${process.env.NEXT_PUBLIC_IEX_TOKEN}`
		);
		const { latestPrice } = apiRes.data;
		res.status(200).json({ latestPrice });
	} else {
		res.status(401).json({ message: 'Not signed in' });
	}
}
