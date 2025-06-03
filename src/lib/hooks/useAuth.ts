// src/hooks/useAuth.ts
const useAuth = () => {
	const user = localStorage.getItem("user"); // Ideally, store a token or login state
	return { isAuthenticated: !!user };
};

export default useAuth;
