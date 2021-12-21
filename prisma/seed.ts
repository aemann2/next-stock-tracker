// invoke w/ `npx prisma db seed`

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

async function main() {
	// // CREATE
	// const john = await prisma.user.create({
	// 	data: {
	// 		name: 'John Doe',
	// 		email: 'john2.test@test.com',
	// 	},
	// });
	// const stock = await prisma.stock.create({
	// 	data: {
	// 		userId: 'ckxb08eq300007jzt3ftpn0s7',
	// 		symbol: 'GOOGL',
	// 		shares: 3,
	// 	},
	// });

	// const date = new Date();
	// const trans = await prisma.transaction.create({
	// 	data: {
	// 		userId: 'ckxb08eq300007jzt3ftpn0s7',
	// 		symbol: 'GOOGL',
	// 		shares: 3,
	// 		price: 421.12,
	// 		transType: 'BUY',
	// 		transacted: date,
	// 	},
	// });

	// MORE CRUD:
	// CREATE
	const testDelete = await prisma.user.create({
		data: {
			name: 'John Doe',
			email: 'john3.test@test.com',
		},
	});

	// UPDATE
	const updateCash = await prisma.user.update({
		where: {
			id: 'ckxb08eq300007jzt3ftpn0s7',
		},
		data: {
			balance: 8500,
		},
	});

	// READ
	const userStocks = await prisma.stock.findMany({
		where: {
			userId: 'ckxb08eq300007jzt3ftpn0s7',
		},
	});

	const user = await prisma.user.findUnique({
		where: {
			id: 'ckxb08eq300007jzt3ftpn0s7',
		},
	});

	// DELETE
	const deleted = await prisma.user.delete({
		where: {
			email: 'john3.test@test.com',
		},
	});

	const users = await prisma.user.findMany();

	console.log({ userStocks, user, users, deleted });
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
