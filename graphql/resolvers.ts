import { Context } from './context';

export const resolvers = {
	Query: {
		users: async (_parent: any, _args: any, ctx: Context) =>
			await ctx.prisma.user.findMany(),
		user: async (_parent: any, args: any, ctx: Context) =>
			await ctx.prisma.user.findUnique({
				where: {
					email: args.email,
				},
			}),
	},
};

// user: async (_parent: any, args: any, ctx: Context) =>
// await ctx.prisma.user.findUnique({
// 	where: {
// 		email: args.email,
// 	},
// }),

// await ctx.prisma.user.findUnique({
// 	where: {
// 		email: 'john2.test@test.com',
// 	},
// }),

// Test query
// Query: {
// 	users: () => [
// 		{
// 			id: '123',
// 			name: 'John Doe',
// 			email: 'john@test.com',
// 			image: '123123',
// 			balance: 10000,
// 			stocks: [
// 				{
// 					userId: '123',
// 					symbol: 'APPL',
// 					shares: 3,
// 				},
// 			],
// 			transactions: [
// 				{
// 					userId: '123',
// 					symbol: 'APPL',
// 					shares: 3,
// 					price: 9.2,
// 					transType: 'BUY',
// 					transacted: '10-14-1987',
// 				},
// 			],
// 		},
// 	],
// },
