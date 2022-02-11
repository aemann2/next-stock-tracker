export interface Stock {
	symbol: string;
	shares: number;
}
export interface StockPrice {
	name: string;
	price: number;
}

export interface StockQueryData {
	[stock: string]: {
		quote: {
			companyName: string;
			latestPrice: number;
		};
	};
}

export interface Transaction {
	symbol: string;
	shares: number;
	price: number;
	transType: TransType;
	transacted: string;
}

enum TransType {
	BUY,
	SELL,
}
