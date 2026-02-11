/// <reference types="vite/client" />

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
//import basicSsl from '@vitejs/plugin-basic-ssl';
import { Variables } from './src/utils';

export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	// Set the third parameter to '' to load all env regardless of the
	// `VITE_` prefix.
	const env = loadEnv(mode, process.cwd(), '');
	const variableNames = Object.values(Variables);
	const variables: { [key: string]: string } = {};
	for (const key of variableNames) {
		variables[`import.meta.env.${key}`] = JSON.stringify(env[key]);
	}

	return {
		base: '/',
		define: {
			// Provide an explicit app-level constant derived from an env var.
			__APP_ENV__: JSON.stringify(env[Variables.appEnv]),
			...variables,
		},
		// Example: use an env var to set the dev server port conditionally.
		server: {
			port: env.FRONT_PORT ? Number(env[Variables.frontPort]) : 5173,
		},
		plugins: [
			react(),
			//basicSsl(),
		],
	};
});
