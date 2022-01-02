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
		stocks: async (_parent: any, args: any, ctx: Context) =>
			await ctx.prisma.stock.findMany({
				where: {
					userId: args.userId,
				},
			}),
		transactions: async (_parent: any, args: any, ctx: Context) =>
			await ctx.prisma.transaction.findMany({
				where: {
					userId: args.userId,
				},
			}),
	},
	Mutation: {
		addStock: async (_parent: any, args: any, ctx: Context) =>
			await ctx.prisma.stock.create({
				data: {
					userId: args.userId,
					symbol: args.symbol,
					shares: args.shares,
				},
			}),
		addTransaction: async (_parent: any, args: any, ctx: Context) =>
			await ctx.prisma.transaction.create({
				data: {
					userId: args.userId,
					symbol: args.symbol,
					shares: args.shares,
					price: args.price,
					transType: args.transType,
					transacted: new Date('2021-03-19T14:21:00+0200'),
				},
			}),
		modifyStock: async (_parent: any, args: any, ctx: Context) =>
			await ctx.prisma.stock.updateMany({
				where: {
					userId: args.userId,
					symbol: args.symbol,
				},
				data: {
					shares: args.shares,
				},
			}),
		modifyUser: async (_parent: any, args: any, ctx: Context) =>
			await ctx.prisma.user.update({
				where: {
					id: args.id,
				},
				data: {
					balance: args.balance,
				},
			}),
		deleteStock: async (_parent: any, args: any, ctx: Context) =>
			await ctx.prisma.stock.delete({
				where: {
					id: args.id,
				},
			}),
	},
};