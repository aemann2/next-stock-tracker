import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: {
					label: 'Email',
					type: 'email',
					placeholder: 'jsmith@hotmail.com',
				},
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, req) {
				const user = { id: 1, name: 'J Smith', email: 'jsmith@example.com' };

				if (user) {
					// Any object returned will be saved in `user` property of the JWT
					return user;
				} else {
					// If you return null or false then the credentials will be rejected
					return null;
					// You can also Reject this callback with an Error or with a URL:
					// throw new Error('error message') // Redirect to error page
					// throw '/path/to/redirect'        // Redirect to a URL
				}
			},
		}),
		// 		// Add logic here to look up the user from the credentials supplied....we need to do a DB lookup
		// 		if (
		// 			credentials!.email === 'test@test.com' &&
		// 			credentials!.password === '123'
		// 		) {
		// 			return {
		// 				id: 1,
		// 				name: 'test',
		// 				email: 'test@test.com',
		// 			};

		// 			// if (user) {
		// 			// 	// Any object returned will be saved in `user` property of the JWT
		// 			// 	console.log('yes');
		// 			// 	console.log(user);
		// 			// 	return user;
		// 		}
		// 		return null;
		// 	},
		// }),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			console.log('RUNNING');
			if (token) {
				session.id = token.id;
			}
			return session;
		},
	},
	secret: 'test',
	jwt: {
		secret: 'test',
	},
});
