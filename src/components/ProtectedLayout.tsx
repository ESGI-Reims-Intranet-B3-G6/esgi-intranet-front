import { Outlet } from "react-router";

function ProtectedLayout() {
	return (
		<>
			<p>TODO: LAYOUT PROTECTED</p>
			<Outlet />
		</>
	);
}

export const Component = ProtectedLayout;
