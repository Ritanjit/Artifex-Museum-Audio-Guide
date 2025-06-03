import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer/footer";
import FloatingQRButton from "@/components/floatingButton/floatingButton";
// import ChatBotWidget from "../chatbot/chatwinget";
import GeminiChatWidget from "../chatbot/floatingChatWidget";
import ChatBotWidgetPlus from "../chatbot/chatbotWidget";
import ChatBotWidget from "../chatbot/chatbotWidget";

const RootLayout: React.FC = () => {
	return (
		<>
			<Navbar />
			<main className="min-h-screen">
				<Outlet /> {/* 👈 This is essential for rendering nested routes */}
			</main>
			<FloatingQRButton />
			{/* <ChatBotWidget /> */}
			{/* <GeminiChatWidget /> */}
			{/* <ChatBotWidgetPlus /> */}
			<ChatBotWidget />
			<Footer />
		</>
	);
};

export default RootLayout;
