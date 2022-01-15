import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { gql, useQuery } from '@apollo/client';
import { addApolloState, initializeApollo } from '../lib/apolloClient';

interface IProps {
	email: string;
	id: string;
}

interface stock {
	symbol: string;
	shares: number;
}

const TRANSACTIONS = gql`
	query Transactions($userId: String!) {
		transactions(userId: $userId) {
			symbol
			shares
			price
			transType
			transacted
		}
	}
`;

const History: React.FC<IProps> = (props) => {
	const { email, id } = props;
	const { loading, error, data } = useQuery(TRANSACTIONS, {
		variables: {
			userId: id,
		},
	});
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Oops, something went wrong {error.message}</p>;
	return (
		<div>
			<p>{email}</p>
			{data.transactions.map((transaction: any, index: any) => (
				<p key={index}>{transaction.symbol}</p>
			))}
		</div>
	);
};

export default History;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	const apolloClient = initializeApollo();
	const user = session!;

	if (!session) {
		return {
			redirect: {
				destination: '/api/auth/signin',
				permanent: false,
			},
		};
	}

	await apolloClient.query({
		query: TRANSACTIONS,
		variables: { userId: user.userId },
	});

	return addApolloState(apolloClient, {
		props: {
			id: user.userId,
			email: user.user.email,
		},
	});
};

// import React from 'react';
// import { GetServerSideProps } from 'next';
// import { getSession } from 'next-auth/react';
// import { gql, useQuery } from '@apollo/client';

// interface IProps {
// 	user: {
// 		email: string;
// 	};
// 	userId: string;
// }

// const TRANSACTIONS = gql`
// 	query Transactions($userId: String!) {
// 		transactions(userId: $userId) {
// 			symbol
// 			shares
// 			price
// 			transType
// 			transacted
// 		}
// 	}
// `;

// const History: React.FC<IProps> = (props) => {
// 	const { data, error, loading } = useQuery(TRANSACTIONS, {
// 		variables: { userId: props.userId },
// 	});
// 	if (loading) return <p>Loading...</p>;
// 	if (error) return <p>Oops, something went wrong {error.message}</p>;
// return (
// 	<div>
// 		<p>{props.user.email}</p>
// 		{data.transactions.map((transaction: any, index: any) => (
// 			<p key={index}>{transaction.symbol}</p>
// 		))}
// 	</div>
// );
// };

// export default History;

// export const getServerSideProps: GetServerSideProps = async (context) => {
// 	const session = await getSession(context);
// 	const data = session!;
// 	if (!session) {
// 		return {
// 			redirect: {
// 				destination: '/api/auth/signin',
// 				permanent: false,
// 			},
// 		};
// 	}
// 	return {
// 		props: data,
// 	};
// };
