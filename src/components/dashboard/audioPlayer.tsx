import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import {
    X,
    Play,
    Pause,
    Trash2,
    Upload,
    Volume2,
    VolumeX,
    Check,
} from "lucide-react";

// --- Types ---
interface AudioFile {
    id: string;
    language: string;
    previewUrl: string;
    fileName: string;
}

// --- Constants ---
const AVAILABLE_LANGUAGES = ["Assamese", "Hindi", "English"];
const COLLECTION_CATEGORIES = [
    "Satras",
    "Mukhas",
    "Ahom Dynasty",
    "Folk Traditions",
    "Royal Seals",
    "Language & Scripts",
];

const PlayerAdmin: React.FC = () => {
    // --- Form State ---
    const [artifactName, setArtifactName] = useState("");
    const [collectionCategory, setCollectionCategory] = useState("");
    const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
    const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);

    // --- Audio Playback State ---
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);

    // --- Toast Notification State ---
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(
        null
    );
    const [showToast, setShowToast] = useState(false);

    // --- Helper: Format time as mm:ss ---
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // --- Helper: Show a toast for 4 seconds ---
    const triggerToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    // --- Handle uploading an audio file for a given language ---
    const handleAudioUpload = (e: ChangeEvent<HTMLInputElement>, language: string) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Remove any existing file for this language
        const updated = audioFiles.filter((f) => f.language !== language);
        const file = files[0];
        const url = URL.createObjectURL(file);

        const newEntry: AudioFile = {
            id: Math.random().toString(36).substring(2, 9),
            language,
            previewUrl: url,
            fileName: file.name,
        };

        setAudioFiles([...updated, newEntry]);
        // If no current language is selected, auto‐select this one
        if (!currentLanguage) {
            setCurrentLanguage(language);
            setIsPlaying(true);
        }
    };

    // --- Remove an uploaded file for a given language ---
    const handleRemoveFile = (language: string) => {
        setAudioFiles((prev) => prev.filter((f) => f.language !== language));
        // If we just removed the currently playing language, stop playback
        if (currentLanguage === language) {
            setCurrentLanguage(null);
            setIsPlaying(false);
        }
    };

    // --- Toggle play/pause for a language card ---
    const handleLanguageClick = (language: string) => {
        if (language === currentLanguage) {
            // Same language: simply toggle play/pause
            setIsPlaying((prev) => !prev);
        } else {
            // Switch to a new language: select + play it
            setCurrentLanguage(language);
            setIsPlaying(true);
        }
    };

    // --- When currentLanguage changes or isPlaying changes, control <audio> ---
    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.volume = volume;
        audioRef.current.muted = isMuted;

        const file = audioFiles.find((f) => f.language === currentLanguage);
        if (file) {
            // If switching languages, load new src and play if isPlaying
            audioRef.current.src = file.previewUrl;
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current
                    .play()
                    .catch((e) => {
                        triggerToast("Error playing audio", "error");
                        console.error(e);
                    });
            } else {
                audioRef.current.pause();
            }
        } else {
            // No file selected → pause
            audioRef.current.pause();
            setCurrentTime(0);
            setDuration(0);
        }
    }, [currentLanguage, isPlaying]);

    // --- Sync time updates + metadata loaded ---
    const handleTimeUpdate = () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    };
    const handleLoadedMetadata = () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
    };
    const handleEnded = () => {
        setIsPlaying(false);
    };

    // --- Seek Bar change ---
    const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // --- Volume change ---
    const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        if (audioRef.current) {
            audioRef.current.volume = newVol;
            audioRef.current.muted = newVol === 0;
            setIsMuted(newVol === 0);
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    // --- Form submission ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!artifactName || !collectionCategory) {
            triggerToast("Please fill all required fields", "error");
            return;
        }
        if (audioFiles.length === 0) {
            triggerToast("Please upload at least one audio file!", "error");
            return;
        }

        // Here you’d send artifactName, collectionCategory, audioFiles[], etc. to your backend.
        console.log("Submitted:", {
            artifactName,
            collectionCategory,
            audioFiles,
        });
        triggerToast("Audio collection saved successfully!", "success");

        // Reset everything
        setAudioFiles([]);
        setCurrentLanguage(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setVolume(0.7);
        setIsMuted(false);
        setArtifactName("");
        setCollectionCategory("");
    };

    // --- Get currently selected AudioFile ---
    const currentAudioFile = audioFiles.find((f) => f.language === currentLanguage);

    return (
        <div className="w-full min-h-screen py-8 bg-gray-100 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            {/* Toast Notification */}
            {showToast && toast && (
                <div
                    className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-sm shadow-lg text-sm max-w-sm ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        } animate-fade-in`}
                >
                    <div className="flex justify-between items-center gap-4">
                        <span>{toast.message}</span>
                        <button onClick={() => setShowToast(false)}>
                            <X size={18} className="hover:text-gray-200" />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Card */}
            <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-md">
                <h2 className="text-3xl font-bold mb-6 text-center">Audio Guide Management</h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Artifact Name & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-medium">Artifact Name *</label>
                            <input
                                type="text"
                                value={artifactName}
                                onChange={(e) => setArtifactName(e.target.value)}
                                placeholder="e.g. History of Auniati Satra"
                                className="w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Collection Category *</label>
                            <select
                                value={collectionCategory}
                                onChange={(e) => setCollectionCategory(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                required
                            >
                                <option value="">Select Category</option>
                                {COLLECTION_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Audio Upload Grid */}
                    <div>
                        <h3 className="text-lg font-medium mb-4">Upload Audio (Max 3 Languages)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {AVAILABLE_LANGUAGES.map((language) => {
                                const file = audioFiles.find((f) => f.language === language);
                                const isCurrent = currentLanguage === language;

                                return (
                                    <div
                                        key={language}
                                        className={`border rounded-lg p-4 transition-all ${isCurrent
                                                ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                                                : "border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-700"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-medium">{language}</span>
                                            {file && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFile(language)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>

                                        {file ? (
                                            <div className="space-y-3">
                                                <div
                                                    className="text-sm truncate"
                                                    title={file.fileName}
                                                >
                                                    {file.fileName}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleLanguageClick(language)}
                                                    className={`flex items-center justify-center w-full py-1.5 rounded-md ${isCurrent && isPlaying
                                                            ? "bg-amber-600 text-white"
                                                            : "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-600 dark:hover:bg-zinc-500"
                                                        }`}
                                                >
                                                    {isCurrent && isPlaying ? (
                                                        <Pause size={16} className="mr-1" />
                                                    ) : (
                                                        <Play size={16} className="mr-1" />
                                                    )}
                                                    {isCurrent && isPlaying ? "Pause" : "Play"}
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="block cursor-pointer">
                                                <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-zinc-500 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-600 transition-colors">
                                                    <Upload size={24} className="text-amber-500 mb-2" />
                                                    <span className="text-sm">Upload Audio</span>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="audio/*"
                                                    onChange={(e) => handleAudioUpload(e, language)}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Audio Player Panel */}
                    {currentAudioFile && (
                        <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg space-y-4">
                            {/* File name + Volume Controls */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-medium truncate">
                                    {currentAudioFile.fileName}
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        type="button"
                                        onClick={toggleMute}
                                        className="text-gray-600 dark:text-gray-300 hover:text-amber-500"
                                    >
                                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                    </button>

                                    {/* Volume Bar with trailing effect */}
                                    <div className="relative w-24 h-2 bg-gray-200 dark:bg-zinc-600 rounded-full overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-amber-500"
                                            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={isMuted ? 0 : volume}
                                            onChange={handleVolumeChange}
                                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Seek Bar */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
                                    {formatTime(currentTime)}
                                </span>
                                <div className="relative flex-1 h-2 bg-gray-200 dark:bg-zinc-600 rounded-full overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-amber-500"
                                        style={{
                                            width: `${duration > 0 ? (currentTime / duration) * 100 : 0
                                                }%`,
                                        }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration || 100}
                                        step="0.01"
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
                                    {formatTime(duration)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Save Audio Collection
                        </button>
                    </div>
                </form>

                {/* Hidden audio element (for playback) */}
                <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleEnded}
                />
            </div>
        </div>
    );
};

export default PlayerAdmin;
