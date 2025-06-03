// import { StrictMode } from "react";
// import { BrowserRouter } from "react-router";
// import { createRoot } from "react-dom/client";

// import App from "@/App";
// import Providers from "@/lib/providers/index.tsx";

// import "@/globals.css";

// createRoot(document.getElementById("root")!).render(
// 	<StrictMode>
// 		<Providers>
// 			<BrowserRouter>
// 				<App />
// 			</BrowserRouter>
// 		</Providers>
// 	</StrictMode>
// );


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globals.css'; // Tailwind and global styles
import { ToastProvider } from "./lib/contexts/ToastContext"; // Toast Notification Message
import { VisitorCounterProvider } from './lib/contexts/VisitorCounterContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ToastProvider>
			<VisitorCounterProvider>
				<App />
			</VisitorCounterProvider>
		</ToastProvider>
	</React.StrictMode>
);

