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
					// TO FIX: This causes a build error
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
				},
			}),
		removeStock: async (_parent: any, args: any, ctx: Context) =>
			await ctx.prisma.stock.update({
				where: {
					// TO FIX: This causes a build error
					//@ts-ignore
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
		modifyUser: async (_parent: any, args: any, ctx: Context) =>
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
		deleteStock: async (_parent: any, args: any, ctx: Context) =>
			await ctx.prisma.stock.delete({
				where: {
					// TO FIX: This causes a build error
					//@ts-ignore
					userStockId: {
						userId: args.userId,
						symbol: args.symbol,
					},
				},
			}),
	},
};
