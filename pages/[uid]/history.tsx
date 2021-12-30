import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { gql, useQuery } from '@apollo/client';

interface IProps {
	user: {
		email: string;
	};
	userId: string;
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
	const { data, error, loading } = useQuery(TRANSACTIONS, {
		variables: { userId: props.userId },
	});
	// const { transactions } = data;
	loading && <p>Loading...</p>;
	error && <p>Oops, something went wrong {error.message}</p>;
	// console.log(data);
	data && console.log(data);
	return (
		<div>
			<p>{props.user.email}</p>
			{data &&
				data.transactions.map((transaction: any, index: any) => (
					<p key={index}>{transaction.symbol}</p>
				))}
		</div>
	);
};

export default History;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	const data = session!;
	if (!session) {
		return {
			redirect: {
				destination: '/api/auth/signin',
				permanent: false,
			},
		};
	}
	return {
		props: data,
	};
};
