import { useSession, signIn, signOut } from 'next-auth/react';
import { gql, useQuery } from '@apollo/client';

const allUsersQuery = gql`
	query {
		users {
			id
			email
			balance
		}
	}
`;

export default function Component() {
	const { data: session } = useSession();
	const { data, error, loading } = useQuery(allUsersQuery);

	if (loading) return <p>Loading...</p>;

	if (error) return <p>Oops, something went wrong {error.message}</p>;

	console.log(data);

	if (session) {
		return (
			<>
				Signed in as {session.user.email} <br />
				<button onClick={() => signOut()}>Sign out</button>
			</>
		);
	}
	return (
		<>
			Not signed in <br />
			<button onClick={() => signIn()}>Sign in</button>
		</>
	);
}
