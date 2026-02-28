import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import './Home.css';
import { env, Variables } from '../utils';
import { useGetUserInfoQuery, useLazyPingQuery } from '../services';
import { useEffect, useState } from 'react';
import { FullscreenLoader } from "../components/FullscreenLoader.tsx";

function Home() {
  const [count, setCount] = useState(0);
	const [showError, setShowError] = useState(false);
	const [ping, { data, isFetching, isError }] = useLazyPingQuery();

	const { data: userInfo, isLoading: isUserInfoLoading, isError: isUserInfoError } = useGetUserInfoQuery();

	async function handleGetHello() {
		await ping('user', true);
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
		<div id="home-root">
      <FullscreenLoader loading={isUserInfoLoading} />
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
				<button style={{ marginRight: '1rem' }} onClick={() => setCount(count + 1)}>
					Increment count: {count}
				</button>
				<button style={{ marginRight: '1rem' }} onClick={() => setCount(count - 1)}>
					Decrement count: {count}
				</button>
				<button style={{ marginRight: '1rem' }} onClick={handleGetHello}>
					Press to test backend call
				</button>
				{isFetching && <p>Loading hello result...</p>}
				{data && <p>The API call result: '{data}'</p>}
				{showError && <p>An error occured when calling backend</p>}
				{isUserInfoLoading && <p>Loading user info...</p>}
				{isUserInfoError && <p>Error when getting user info: you are probably not logged in</p>}
				{userInfo && <p>{JSON.stringify(userInfo)}</p>}
				<p>Backend URL: {env(Variables.backendUrl)}</p>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</div>
	);
}

export const Component = Home;
