import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import '../App.css';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { decrement, increment } from '../store/auth/slice.ts';
import { env, storage, Variables } from '../utils';
import { useGetUserInfoQuery, useLazyGetHelloByNameQuery, useLazyLogoutQuery } from '../services/auth/api.ts';
import { useEffect, useState } from 'react';

function Home() {
	const count = useSelector((state: RootState) => state.auth.value);
	const dispatch = useDispatch();
	const [showError, setShowError] = useState(false);
	const [getHelloByName, { isFetching, isError }] = useLazyGetHelloByNameQuery();
	const [logout, { isLoading: isLogoutLoading, isError: isLogoutError, isSuccess: isLogoutSuccess }] =
		useLazyLogoutQuery();
	const [data, setData] = useState<string | undefined>(undefined);
	const { isLoading: isUserInfoLoading, isError: isUserInfoError } = useGetUserInfoQuery();
	const userInfo = useSelector((state: RootState) => state.auth.userInfo);

	const isLoggedIn = storage.getItem('loggedIn') === '1';

	if (isLogoutSuccess) {
		window.location.reload();
	}

	async function handleGetHello() {
		const result = await getHelloByName('test');
		setData(result.data);
	}

	async function handleSignIn() {
		window.location.href = env(Variables.backendUrl) + '/auth/login';
	}

	async function handleSignOut() {
		await logout();
	}

	useEffect(() => {
		if (isError) {
			setShowError(true);
			setTimeout(() => {
				setShowError(false);
			}, 2000);
		}
	}, [isError]);

	return (
		<>
			<div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>ESGI Intranet Backend + Frontend + Auth Tester</h1>
			<div className="card">
				<button style={{ marginRight: '1rem' }} onClick={() => dispatch(increment())}>
					Increment count: {count}
				</button>
				<button style={{ marginRight: '1rem' }} onClick={() => dispatch(decrement())}>
					Decrement count: {count}
				</button>
				<button style={{ marginRight: '1rem' }} onClick={handleGetHello}>
					Press to test backend call
				</button>
				{isLoggedIn ? <button onClick={handleSignOut}>Sign out</button> : <button onClick={handleSignIn}>Sign in</button>}
				{isFetching && <p>Loading hello result...</p>}
				{data && <p>The API call result: '{data}'</p>}
				{showError && <p>An error occured when calling backend</p>}
				{isUserInfoLoading && <p>Loading user info...</p>}
				{isUserInfoError && <p>Error when getting user info: you are probably not logged in</p>}
				{userInfo && <p>{JSON.stringify(userInfo)}</p>}
				{isLogoutLoading && <p>Logging out...</p>}
				{isLogoutError && <p>Error while logging out</p>}
				<p>Backend URL: {env(Variables.backendUrl)}</p>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</>
	);
}

export const Component = Home;
