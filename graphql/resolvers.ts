import { Context } from './context';
import * as model from './models';

export const resolvers = {
	Query: {
		users: async (_parent: undefined, _args: null, ctx: Context) =>
			await ctx.prisma.user.findMany(),
		user: async (_parent: undefined, args: model.queryUserArgs, ctx: Context) =>
			await ctx.prisma.user.findUnique({
				where: {
					id: args.id,
				},
			}),
		stocks: async (
			_parent: undefined,
			args: model.queryStocksArgs,
			ctx: Context
		) =>
			await ctx.prisma.stock.findMany({
				where: {
					userId: args.userId,
				},
			}),
		stock: async (
			_parent: undefined,
			args: model.queryStockArgs,
			ctx: Context
		) =>
			await ctx.prisma.stock.findMany({
				where: {
					userId: args.userId,
					symbol: args.symbol,
				},
			}),
		transactions: async (
			_parent: undefined,
			args: model.queryTransactionsArgs,
			ctx: Context
		) =>
			await ctx.prisma.transaction.findMany({
				where: {
					userId: args.userId,
				},
			}),
	},
	Mutation: {
		addStock: async (
			_parent: undefined,
			args: model.addStockArgs,
			ctx: Context
		) =>
			await ctx.prisma.stock.upsert({
				where: {
					userStockId: {
						userId: args.userId,
						symbol: args.symbol,
					},
				},
				update: {
					shares: {
						increment: args.shares,
					},
				},
				create: {
					userId: args.userId,
					symbol: args.symbol,
					shares: args.shares,
				},
			}),
		addTransaction: async (
			_parent: undefined,
			args: model.addTransactionArgs,
			ctx: Context
		) =>
			await ctx.prisma.transaction.create({
				data: {
					userId: args.userId,
					symbol: args.symbol,
					shares: args.shares,
					price: args.price,
					transType: args.transType,
				},
			}),
		removeStock: async (
			_parent: undefined,
			args: model.removeStockArgs,
			ctx: Context
		) =>
			await ctx.prisma.stock.update({
				where: {
					userStockId: {
						userId: args.userId,
						symbol: args.symbol,
					},
				},
				data: {
					shares: {
						increment: -args.shares,
					},
				},
			}),
		modifyUser: async (
			_parent: undefined,
			args: model.modifyUserArgs,
			ctx: Context
		) =>
			await ctx.prisma.user.update({
				where: {
					id: args.id,
				},
				data: {
					balance: {
						increment: args.price,
					},
				},
			}),
		deleteStock: async (
			_parent: undefined,
			args: model.deleteStockArgs,
			ctx: Context
		) =>
			await ctx.prisma.stock.delete({
				where: {
					userStockId: {
						userId: args.userId,
						symbol: args.symbol,
					},
				},
			}),
	},
};
