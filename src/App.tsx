import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ThemeProvider } from "@/components/theme-provider/theme-provider"
import Navbar  from "@/components/navbar/index";
import HomePage from "@/pages/home";
import AboutPage from "@/pages/about";
import Navbar04Page from "./components/navbar-04/navbar-04";
import Footer from "./components/footer/footer";
import Visit from "./pages/visit/visit";
import Collections from "./pages/collections/collections";
import Event from "./pages/event/event";
import QRScanner from "./components/qrScanner/QRScanner";
import FloatingQRButton from "./components/floatingButton/floatingButton";
import Auth from "./components/authentication/authentication";
// import AudioPlayer from "./pages/audioPlayer/audioPlayer";
import { getUsers } from "./actions/users";
import AudioPlayer from "./pages/audioPlayer/AudioPlayer";
import ScrollToTop from "./components/scrollTop/scrollTop";
// import Admin from "./pages/admin/admin";

function App() {

	getUsers();

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Navbar />
			{/* < ScrollToTop /> */}
			<Routes>
				<Route index element={<HomePage />} />
				<Route path="about" element={<AboutPage />} />
				<Route path="visit" element={<Visit />} />
				<Route path="auth" element={<Auth />} />
				<Route path="/audioplayer" element={<AudioPlayer />} />
				{/* <Route path="/admin" element={<Admin />} /> */}
				<Route path="QRScanner" element={<QRScanner onClose={function (): void {
					throw new Error("Function not implemented.");
				} } />} />
				<Route path="collections" element={<Collections />} />
				<Route path="events" element={<Event />} />
				<Route path="authentication" element={<Auth />} />
			</Routes>
			<FloatingQRButton />
			{/* <Navbar04Page /> */}
			<Footer />
		</ThemeProvider>
		
	);
}

export default App;
