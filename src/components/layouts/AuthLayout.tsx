import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
	return (
		<main className="min-h-screen bg-white dark:bg-black">
			<Outlet />
		</main>
	);
};

export default AuthLayout;
