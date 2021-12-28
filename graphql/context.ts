import { PrismaClient } from '.prisma/client';
import prisma from '../lib/prisma';

export type Context = {
	prisma: PrismaClient;
};

// FIX: remove req and res from the context function if they're not used in the future
export async function createContext(req: any, res: any): Promise<Context> {
	return {
		prisma,
	};
}
