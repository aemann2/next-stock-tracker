import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { gql, useMutation } from '@apollo/client';

interface IProps {
	user: {
		email: string;
	};
	userId: string;
}

const ADD_STOCK = gql`
	mutation AddStock($userId: String!) {
		addStock(userId: $userId, symbol: "AAPL", shares: 99) {
			id
		}
	}
`;
const MODIFY_STOCK = gql`
	mutation ModifyStock($id: String!) {
		modifyStock(id: $id, shares: 12) {
			userId
		}
	}
`;

const MODIFY_USER = gql`
	mutation ModifyUser($id: String!) {
		modifyUser(id: $id, balance: 9938.23) {
			id
		}
	}
`;

const ADD_TRANSACTION = gql`
	mutation AddTransaction($userId: String!) {
		addTransaction(
			userId: $userId
			symbol: "AAPL"
			shares: 99
			price: 48.39
			transType: BUY
		) {
			userId
		}
	}
`;

const Buy: React.FC<IProps> = (props) => {
	const [addStock, { data, loading, error }] = useMutation(ADD_STOCK, {
		variables: { userId: props.userId },
	});
	const [addTransaction, { data: data2, loading: loading2, error: error2 }] =
		useMutation(ADD_TRANSACTION, {
			variables: { userId: props.userId },
		});
	loading2 && <p>Loading...</p>;
	error2 && <p>Oops, something went wrong {error2.message}</p>;
	addStock({
		variables: { userId: props.userId },
	});
	addTransaction({
		variables: { userId: props.userId },
	});
	return (
		<div>
			<p>{props.user.email}</p>
		</div>
	);
};

export default Buy;

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
