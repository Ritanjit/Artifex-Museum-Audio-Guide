// src\App.tsx
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
import PlayerAdmin from "./components/dashboard/audioUpload";
import FeedbackAdmin from "./components/dashboard/feedbackManager";
import EventsAdmin from "./components/dashboard/eventsAdmin";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import Plan from "./pages/visit/plan";
import FloatingHomeButton from "./components/authentication/floatingHomeButton";
import Feedback from "./pages/feedback/feedback";
import Questionnaire from "./components/questionaire/questionaire";
import Certificate from "./components/questionaire/certificate";
import CloudUpload from "./components/dashboard/cloudUpload";
import CollectionsManager from "./components/dashboard/collectionManager";
import DynamicAudioPlayer from "./pages/audioPlayer/DynamicAudioPlayer";
import AudioPlayerManager from "@/components/dashboard/AudioPlayerManager";
import UploadManager from "./components/dashboard/uploadManager";
import ArtifactManager from "./components/dashboard/artifactManager";
import VisitorCounter from "@/components/visitorCounter/VisitorCounter";
import News from "./pages/news/news";

function App() {

	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<Router>
				<VisitorCounter />
				<Routes>
					{/* All public routes under RootLayout */}
					<Route path="/" element={<RootLayout />}>
						<Route index element={<HomePage />} />
						<Route path="collections" element={<Collections />} />
						<Route path="events" element={<Event />} />
						<Route path="news" element={<News />} />
						<Route path="visit" element={<Visit />} />
						<Route path="feedback" element={<Feedback />} />
						<Route path="about" element={<AboutPage />} />
						<Route path="QRScanner" element={<QRScanner onClose={() => { }} />} />
						{/* Fallback route for Audio Player */}
						<Route path="audioplayer" element={<AudioPlayer />} />
						{/* Dynamic Route for Audio Player (older double form method) */}
						{/* <Route path="audioplayer/:collectionItemId" element={<DynamicAudioPlayer />} /> */}
						{/* Dynamic Route for Audio Player (new uploadManager.tsx method) */}
						<Route path="audioplayer/:artifactId" element={<DynamicAudioPlayer />} />
						<Route path="mukha" element={<MukhasBlog />} />
						<Route path="plan" element={<Plan />} />
						<Route path="questionnaire" element={<Questionnaire />} />
						<Route path="certificate" element={<Certificate />} />
					</Route>

					{/* Auth-only layout routes */}
					<Route element={<AuthLayout />}>
						<Route path="/auth" element={<Auth />} />

						<Route
							path="/admin"
							element={
								<ProtectedRoute>
									<AdminPage />
								</ProtectedRoute>
							}
						>
							<Route index element={<Dashboard />} />
							<Route path="upload" element={<CollectionsUpload />} />
							<Route path="playerAdmin" element={<PlayerAdmin />} />
							<Route path="feedbackAdmin" element={<FeedbackAdmin />} />
							<Route path="eventsAdmin" element={<EventsAdmin />} />
							<Route path="cloudUpload" element={<CloudUpload />} />
							<Route path="collectionManager" element={<CollectionsManager />} />
							<Route path="audioManager" element={<AudioPlayerManager />} />
							<Route path="uploadManager" element={<UploadManager />} />
							<Route path="artifactManager" element={<ArtifactManager />} />
						</Route>
					</Route>

				</Routes>
			</Router>
		</ThemeProvider>
	);
}

export default App;