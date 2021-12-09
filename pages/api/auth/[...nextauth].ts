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
			name: 'Email and Password',
			credentials: {
				email: {
					label: 'Email',
					type: 'text',
					placeholder: 'jsmith@hotmail.com',
				},
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, req) {
				// Add logic here to look up the user from the credentials supplied....we need to do a DB lookup
				const user = { id: 1, name: 'J Smith', email: 'jsmith@example.com' };

				if (user) {
					// Any object returned will be saved in `user` property of the JWT
					console.log('yes');
					console.log(user);
					return user;
				} else {
					// If you return null or false then the credentials will be rejected
					console.log('no');
					return null;
					// You can also Reject this callback with an Error or with a URL:
					// throw new Error('error message') // Redirect to error page
					// throw '/path/to/redirect'        // Redirect to a URL
				}
			},
		}),
	],
	callbacks: {
		jwt: ({ token, user }) => {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		session: ({ session, token }) => {
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
