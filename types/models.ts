export interface Stock {
	symbol: string;
	shares: number;
}

export interface StockQueryData {
	[stock: string]: {
		quote: {
			companyName: string;
			latestPrice: number;
		};
	};
}
