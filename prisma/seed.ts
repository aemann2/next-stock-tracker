// invoke w/ `npx prisma db seed`

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

async function main() {
	const john = await prisma.user.create({
		data: {
			name: 'John Doe',
			email: 'john2.test@test.com',
		},
	});
	const appleStock = await prisma.stock.create({
		data: {
			userId: 'ckxb08eq300007jzt3ftpn0s7',
			symbol: 'AAPL',
			shares: 2,
		},
	});

	const date = new Date();
	const appleTrans = await prisma.transaction.create({
		data: {
			userId: 'ckxb08eq300007jzt3ftpn0s7',
			symbol: 'AAPL',
			shares: 2,
			price: 1.1,
			transType: 'BUY',
			transacted: date,
		},
	});

	// console.log({ john, appleStock, appleTrans });
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
