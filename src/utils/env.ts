const Variables = {
	appEnv: 'APP_ENV',
	frontPort: 'FRONT_PORT',
	backendUrl: 'BACKEND_URL',
	debugProtectedRoute: 'DEBUG_PROTECTED_ROUTE',
} as const;

type Variable = (typeof Variables)[keyof typeof Variables];

export { Variables };
export type { Variable };

export function env(variable: Variable): string | undefined {
	return import.meta.env[variable];
}
