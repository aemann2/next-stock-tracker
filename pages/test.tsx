import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

const Test: React.FC<any> = (props) => {
	return (
		<div>
			<h1>Test page</h1>
			<p>{props.user}</p>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	const data = { user: 'adam' };
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

export default Test;
