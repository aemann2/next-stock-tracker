export const resolvers = {
	Query: {
		users: () => [
			{
				id: '123',
				name: 'John Doe',
				email: 'john@test.com',
				image: '123123',
				balance: 10000,
				stocks: [],
				transactions: [],
			},
		],
	},
};
