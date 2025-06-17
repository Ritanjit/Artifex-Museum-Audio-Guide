// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globals.css';
import { ToastProvider } from "./lib/contexts/ToastContext";
import { VisitorCounterProvider } from "./lib/contexts/VisitorCounterContext"; // Add this

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ToastProvider>
			<VisitorCounterProvider> {/* Wrap with provider */}
				<App />
			</VisitorCounterProvider>
		</ToastProvider>
	</React.StrictMode>
);

