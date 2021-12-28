import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { gql, useQuery } from '@apollo/client';

interface IProps {
	user: {
		email: string;
	};
}

const transactionsQuery = gql`
	query {
		transactions(userId: "ckxb08eq300007jzt3ftpn0s7") {
			symbol
			shares
			price
			transType
			transacted
		}
	}
`;

const History: React.FC<IProps> = (props) => {
	const { data, error, loading } = useQuery(transactionsQuery);
	const { transactions } = data;
	return (
		<div>
			<p>{props.user.email}</p>
			{transactions.map((transaction: any, index: any) => (
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
