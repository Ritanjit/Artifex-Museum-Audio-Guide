// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { ThemeProvider } from "@/components/theme-provider/theme-provider";

// // Layouts
// import RootLayout from "@/components/layouts/RootLayout";
// import AuthLayout from "@/components/layouts/AuthLayout";

// // Pages
// import HomePage from "@/pages/home";
// import AboutPage from "@/pages/about";
// import Visit from "@/pages/visit/visit";
// import Collections from "@/pages/collections/collections";
// import Event from "@/pages/event/event";
// import QRScanner from "@/components/qrScanner/QRScanner";
// import Auth from "@/components/authentication/authentication";
// import AdminPage from "@/pages/admin/admin";
// import AudioPlayer from "@/pages/audioPlayer/AudioPlayer";
// import MukhasBlog from "@/pages/blog/mukha";

// function App() {
// 	return (
// 		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
// 			<Router>
// 				<Routes>
// 					{/* Root Layout: navbar + footer + QR button */}
// 					<Route element={<RootLayout />}>
// 						<Route index element={<HomePage />} />
// 						<Route path="about" element={<AboutPage />} />
// 						<Route path="visit" element={<Visit />} />
// 						<Route path="collections" element={<Collections />} />
// 						<Route path="events" element={<Event />} />
// 						<Route path="mukha" element={<MukhasBlog />} />
// 						<Route path="audioplayer" element={<AudioPlayer />} />
// 						<Route path="QRScanner" element={<QRScanner onClose={() => { }} />} />
// 					</Route>

// 					{/* Auth Layout: minimal layout for login/admin */}
// 					<Route element={<AuthLayout />}>
// 						<Route path="auth" element={<Auth />} />
// 						<Route path="admin" element={<AdminPage />} />
// 					</Route>
// 				</Routes>
// 			</Router>
// 		</ThemeProvider>
// 	);
// }

// export default App;




import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ThemeProvider } from "@/components/theme-provider/theme-provider"
import Navbar from "@/components/navbar/index";
import HomePage from "@/pages/home";
import AboutPage from "@/pages/about";
import Footer from "./components/footer/footer";
import Visit from "./pages/visit/visit";
import Collections from "./pages/collections/collections";
import Event from "./pages/event/event";
import QRScanner from "./components/qrScanner/QRScanner";
import FloatingQRButton from "./components/floatingButton/floatingButton";
import Auth from "./components/authentication/authentication";
import { login, getUsers } from "./actions/users";
import AudioPlayer from "./pages/audioPlayer/AudioPlayer";
import AdminPage from "./pages/admin/admin";
import MukhasBlog from "./pages/blog/mukha";

function App() {

	getUsers();

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

			<Navbar />

			<Routes>

				<Route index element={<HomePage />} />
				<Route path="collections" element={<Collections />} />
				<Route path="events" element={<Event />} />
				<Route path="visit" element={<Visit />} />
				<Route path="about" element={<AboutPage />} />
				<Route path="QRScanner" element={<QRScanner onClose={function (): void {
					throw new Error("Function not implemented.");
				}} />} />
				<Route path="/audioplayer" element={<AudioPlayer />} />
				<Route path="mukha" element={<MukhasBlog />} />

				<Route path="auth" element={<Auth />} />
				<Route path="/admin" element={<AdminPage />} />
				
			</Routes>

			<FloatingQRButton />

			<Footer />

		</ThemeProvider>

	);
}

export default App;
