import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { GET_TRANSACTIONS } from '../queries';
import { useQuery } from '@apollo/client';
import { addApolloState, initializeApollo } from '../lib/apolloClient';

interface IProps {
	email: string;
	id: string;
}

const History: React.FC<IProps> = (props) => {
	const { email, id } = props;
	const { loading, error, data } = useQuery(GET_TRANSACTIONS, {
		variables: {
			userId: id,
		},
	});
	console.log(data.transactions[0].transacted);
	console.log(new Date(1643666443555));
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Oops, something went wrong {error.message}</p>;
	return (
		<div>
			<p>{email}</p>
			{data.transactions.map((transaction: any, index: any) => (
				<div key={index}>
					<span>{transaction.symbol}</span> | <span>{transaction.shares}</span>{' '}
					| <span>{transaction.price}</span> |{' '}
					<span>{transaction.transType}</span> |{' '}
					<span>
						{new Date(Number(transaction.transacted)).toLocaleString()}
					</span>
				</div>
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
		query: GET_TRANSACTIONS,
		variables: { userId: user.userId },
	});

	return addApolloState(apolloClient, {
		props: {
			id: user.userId,
			email: user.user.email,
		},
	});
};
