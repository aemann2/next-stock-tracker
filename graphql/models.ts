// queries
export interface queryUserArgs {
	id: string;
}
export interface queryStocksArgs {
	userId: string;
}
export interface queryStockArgs {
	userId: string;
	symbol: string;
}
export interface queryTransactionsArgs {
	userId: string;
}

// mutations
export interface addStockArgs {
	userId: string;
	symbol: string;
	shares: number;
}
export interface addTransactionArgs {
	userId: string;
	symbol: string;
	shares: number;
	price: number;
	transType: any;
}

export interface removeStockArgs {
	userId: string;
	symbol: string;
	shares: number;
}

export interface modifyUserArgs {
	id: string;
	price: number;
}

export interface deleteStockArgs {
	userId: string;
	symbol: string;
}
