// src/components/authentication/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../lib/hooks/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/auth" replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
