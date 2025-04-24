import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import HomePage from "@/pages/home";
import AboutPage from "@/pages/about";
import Visit from "@/pages/visit/visit";
import Collections from "@/pages/collections/collections";
import Event from "@/pages/event/event";
import QRScanner from "@/components/qrScanner/QRScanner";
import Auth from "@/components/authentication/authentication";
import AudioPlayer from "@/pages/audioPlayer/AudioPlayer";
import AdminPage from "@/pages/admin/admin";
import MukhasBlog from "@/pages/blog/mukha";
import RootLayout from "@/components/layouts/RootLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
import CollectionsUpload from "./components/dashboard/upload";
import Dashboard from "./components/dashboard/dashboard";
import PlayerAdmin from "./components/dashboard/audioPlayer";
import FeedbackAdmin from "./components/dashboard/feedback";
import EventsAdmin from "./components/dashboard/events";

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Router>
				<Routes>
					{/* All public routes under RootLayout */}
					<Route path="/" element={<RootLayout />}>
						<Route index element={<HomePage />} />
						<Route path="collections" element={<Collections />} />
						<Route path="events" element={<Event />} />
						<Route path="visit" element={<Visit />} />
						<Route path="about" element={<AboutPage />} />
						<Route path="QRScanner" element={<QRScanner onClose={() => { }} />} />
						<Route path="audioplayer" element={<AudioPlayer />} />
						<Route path="mukha" element={<MukhasBlog />} />
					</Route>

					{/* Auth-only layout routes */}
					<Route element={<AuthLayout />}>
						<Route path="/auth" element={<Auth />} />
						{/* Make AdminPage a layout route */}
						<Route path="/admin" element={<AdminPage />}>
							<Route path="upload" element={<CollectionsUpload />} />
							<Route path="dashboard" element={<Dashboard />} />
							<Route path="playerAdmin" element={<PlayerAdmin />} />
							<Route path="feedbackAdmin" element={<FeedbackAdmin />} />
							<Route path="eventsAdmin" element={<EventsAdmin />} />
							{/* Add more child routes here if needed */}
						</Route>
					</Route>
				</Routes>
			</Router>
		</ThemeProvider>
	);
}

export default App;






// import { BrowserRouter as Router, Routes, Route } from "react-router";
// import { ThemeProvider } from "@/components/theme-provider/theme-provider"
// import Navbar from "@/components/navbar/index";
// import HomePage from "@/pages/home";
// import AboutPage from "@/pages/about";
// import Footer from "./components/footer/footer";
// import Visit from "./pages/visit/visit";
// import Collections from "./pages/collections/collections";
// import Event from "./pages/event/event";
// import QRScanner from "./components/qrScanner/QRScanner";
// import FloatingQRButton from "./components/floatingButton/floatingButton";
// import Auth from "./components/authentication/authentication";
// import { login, getUsers } from "./actions/users";
// import AudioPlayer from "./pages/audioPlayer/AudioPlayer";
// import AdminPage from "./pages/admin/admin";
// import MukhasBlog from "./pages/blog/mukha";

// function App() {

// 	getUsers();

// 	return (
// 		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

// 			<Navbar />

// 			<Routes>

// 				<Route index element={<HomePage />} />
// 				<Route path="collections" element={<Collections />} />
// 				<Route path="events" element={<Event />} />
// 				<Route path="visit" element={<Visit />} />
// 				<Route path="about" element={<AboutPage />} />
// 				<Route path="QRScanner" element={<QRScanner onClose={function (): void {
// 					throw new Error("Function not implemented.");
// 				}} />} />
// 				<Route path="/audioplayer" element={<AudioPlayer />} />
// 				<Route path="mukha" element={<MukhasBlog />} />

// 				<Route path="auth" element={<Auth />} />
// 				<Route path="/admin" element={<AdminPage />} />

// 			</Routes>

// 			<FloatingQRButton />

// 			<Footer />

// 		</ThemeProvider>

// 	);
// }

// export default App;
