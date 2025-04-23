import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer/footer";
import FloatingQRButton from "@/components/floatingButton/floatingButton";

const RootLayout: React.FC = () => {
	return (
		<>
			<Navbar />
			<main className="min-h-screen">
				<Outlet />
			</main>
			<FloatingQRButton />
			<Footer />
		</>
	);
};

export default RootLayout;
