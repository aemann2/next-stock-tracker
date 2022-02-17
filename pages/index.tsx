import { useSession, signIn, signOut } from 'next-auth/react';
// REMOVE: test for redux
// import { useAppSelector } from '../hooks';

export default function Component() {
	const { data: session, status } = useSession();

	// REMOVE: tests for redux
	// const darkMode = useAppSelector((state) => state.mode.darkMode);
	// console.log(darkMode);
	// const cash = useAppSelector((state) => state.nav.cash);
	// console.log(cash);

	if (status === 'loading') {
		return <p>Loading...</p>;
	}

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
