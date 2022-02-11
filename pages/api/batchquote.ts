import axios from 'axios';
import { getSession } from 'next-auth/react';
import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
	const session = await getSession({ req });
	if (session) {
		const symbols = req.query.symbols;
		const apiRes = await axios.get(
			`https://cloud.iexapis.com/v1/stock/market/batch?&types=quote&symbols=${symbols}&token=${process.env.NEXT_PUBLIC_IEX_TOKEN}`
		);
		res.status(200).json({ data: apiRes.data });
	} else {
		res.status(401).json({ message: 'Not signed in' });
	}
}
