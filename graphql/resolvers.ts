import { prisma } from '@prisma/client';
import { Context } from './context';

export const resolvers = {
	Query: {
		users: async (_parent: any, _args: any, ctx: Context) =>
			await ctx.prisma.user.findMany(),
		user: async (_parent: any, args: any, ctx: Context) =>
			await ctx.prisma.user.findUnique({
				where: {
					id: args.id,
				},
			}),
		stocks: async (_parent: any, args: any, ctx: Context) =>
			await ctx.prisma.stock.findMany({
				where: {
					userId: args.userId,
				},
			}),
		stock: async (_parent: any, args: any, ctx: Context) =>
			await ctx.prisma.stock.findMany({
				where: {
					userId: args.userId,
					symbol: args.symbol,
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
			await ctx.prisma.stock.upsert({
				where: {
					//@ts-ignore
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
			await ctx.prisma.stock.update({
				where: {
					//@ts-ignore
					userStockId: {
						userId: args.userId,
						symbol: args.symbol,
					},
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
					balance: {
						increment: -args.price,
					},
				},
			}),
		deleteStock: async (_parent: any, args: any, ctx: Context) =>
			await ctx.prisma.stock.delete({
				where: {
					//@ts-ignore
					userStockId: {
						userId: args.userId,
						symbol: args.symbol,
					},
				},
			}),
	},
};
