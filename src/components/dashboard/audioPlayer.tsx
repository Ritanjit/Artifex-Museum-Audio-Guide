import React, { useState, useRef, useEffect } from "react";
import { X, Play, Pause, Trash2, Edit, Upload, Volume2, VolumeX } from "lucide-react";

const PlayerAdmin: React.FC = () => {
    // Audio states
    const [audioPreview, setAudioPreview] = useState<string | null>(null);
    const [audioName, setAudioName] = useState("");
    const [fileName, setFileName] = useState("");
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);

    // Other states
    const [languages, setLanguages] = useState<string[]>([]);
    const [currentLanguage, setCurrentLanguage] = useState("");
    const [collectionCategory, setCollectionCategory] = useState("");
    const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [showToast, setShowToast] = useState(false);

    // Data
    const collectionCategories = ["Satras", "Mukhas"];
    const availableLanguages = ["English", "Hindi", "Assamese"];

    const collectionSubCategories: Record<string, string[]> = {
        Satras: [
            "Auniati Satra",
            "Kamalabari Satra",
            "Dakhinpat Satra",
            "Garhmur Satra",
            "Bengenaati Satra"
        ],
        Mukhas: [
            "Ravana Mukha",
            "Hanuman Mukha",
            "Narasimha Mukha",
            "Garuda Mukha",
            "Hiranyakashipu Mukha"
        ]
    };

    // Format time (mm:ss)
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Handle sub-category selection
    const handleSubCategorySelect = (subCategory: string) => {
        setSelectedSubCategory(subCategory);
        setShowSubCategoryModal(false);
    };

    // Handle language removal
    const handleRemoveLanguage = (lang: string) => {
        setLanguages(languages.filter(l => l !== lang));
    };

    // Handle language addition
    const handleAddLanguage = () => {
        if (currentLanguage && !languages.includes(currentLanguage)) {
            setLanguages([...languages, currentLanguage]);
            setCurrentLanguage("");
        }
    };

    // Handle audio upload
    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAudioPreview(url);
            setFileName(file.name);

            // Reset player state when new file is uploaded
            setIsPlaying(false);
            setCurrentTime(0);
        }
    };

    // Audio event handlers
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => {
                    triggerToast("Error playing audio", "error");
                    console.error("Playback error:", e);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Handle collection category change - MODIFIED TO SHOW SUB-CATEGORY MODAL
    const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const category = e.target.value;
        setCollectionCategory(category);

        // Reset sub-category when main category changes
        setSelectedSubCategory("");

        // Show modal if category has sub-categories
        if (category && collectionSubCategories[category]) {
            setShowSubCategoryModal(true);
        }
    };

    // Toast notification
    const triggerToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    // Form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!audioName || !collectionCategory || !selectedSubCategory || languages.length === 0) {
            triggerToast("Please fill all required fields", "error");
            return;
        }

        if (!audioPreview) {
            triggerToast("Please upload an audio file!", "error");
            return;
        }

        console.log("Submitted data:", {
            audioName,
            collectionCategory,
            selectedSubCategory,
            languages,
            fileName
        });

        triggerToast("Audio uploaded successfully!", "success");

        // Reset form
        setAudioName("");
        setLanguages([]);
        setCurrentLanguage("");
        setCollectionCategory("");
        setSelectedSubCategory("");
        setAudioPreview(null);
        setFileName("");
        setIsPlaying(false);
    };

    // Initialize audio element
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('ended', () => setIsPlaying(false));
            audio.volume = volume;

            return () => {
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('ended', () => setIsPlaying(false));
            };
        }
    }, [audioPreview]);

    return (
        <div className="w-full h-full overflow-y-auto px-6 sm:px-10 py-10 bg-gray-100 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            {/* Toast Notification */}
            {showToast && toast && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-sm shadow-lg text-sm max-w-sm ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    } animate-slide-in`}>
                    <div className="flex justify-between items-center gap-4">
                        <span>{toast.message}</span>
                        <button onClick={() => setShowToast(false)}>
                            <X size={18} className="hover:text-gray-200" />
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/30 rounded-b-md overflow-hidden">
                        <div className="h-full bg-white animate-progress-bar"></div>
                    </div>
                </div>
            )}

            {/* Sub-Category Selection Modal - NEW COMPONENT */}
            {showSubCategoryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Select {collectionCategory}</h3>
                            <button
                                onClick={() => setShowSubCategoryModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {collectionSubCategories[collectionCategory]?.map((subCat) => (
                                <button
                                    key={subCat}
                                    onClick={() => handleSubCategorySelect(subCat)}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition ${selectedSubCategory === subCat
                                            ? "bg-amber-500 text-white"
                                            : "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                                        }`}
                                >
                                    {subCat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Form */}
            <div className="max-w-6xl mx-auto bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-xl">
                <h2 className="text-3xl font-bold mb-8 text-center">Audio Files Management</h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Audio Upload Section */}
                    <div className="flex flex-col items-center">
                        {!audioPreview ? (
                            <div className="w-full max-w-md text-center">
                                <label className="cursor-pointer block">
                                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                                        <Upload size={48} className="text-amber-500 mb-4" />
                                        <p className="text-lg font-medium mb-1">Upload Audio File</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            MP3, WAV, or OGG files
                                        </p>
                                    </div>
                                    <input
                                        id="audio-upload"
                                        type="file"
                                        accept="audio/*"
                                        onChange={handleAudioUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="w-full max-w-2xl">
                                <div className="bg-gray-50 dark:bg-zinc-700 p-6 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 truncate">
                                        {fileName}
                                    </p>

                                    {/* Media Player Controls */}
                                    <div className="space-y-4">
                                        {/* Play/Pause Button */}
                                        <div className="flex justify-center">
                                            <button
                                                type="button"
                                                onClick={togglePlayPause}
                                                className="bg-amber-500 hover:bg-amber-600 text-white rounded-full p-4 transition-colors"
                                            >
                                                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                            </button>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
                                                {formatTime(currentTime)}
                                            </span>
                                            <input
                                                type="range"
                                                min="0"
                                                max={duration || 100}
                                                value={currentTime}
                                                onChange={handleSeek}
                                                className="flex-1 h-2 bg-gray-200 dark:bg-zinc-600 rounded-full 
                                                appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none 
                                                [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 
                                                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500"
                                            />
                                            <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
                                                {formatTime(duration)}
                                            </span>
                                        </div>

                                        {/* Volume Controls */}
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={toggleMute}
                                                className="text-gray-600 dark:text-gray-300 hover:text-amber-500"
                                            >
                                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                            </button>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={isMuted ? 0 : volume}
                                                onChange={handleVolumeChange}
                                                className="w-24 h-2 bg-gray-200 dark:bg-zinc-600 rounded-full 
                                                appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none 
                                                [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 
                                                [&::-webkit-slider-thumb]:rounded-full 
                                                [&::-webkit-slider-thumb]:bg-amber-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setAudioPreview(null);
                                        setFileName("");
                                        setIsPlaying(false);
                                    }}
                                    className="mt-3 text-sm text-red-500 hover:text-red-700 flex items-center 
                                    justify-center gap-1"
                                >
                                    <Trash2 size={14} /> Remove Audio
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Audio Title */}
                    <div>
                        <label className="block mb-2 font-semibold">Audio Title</label>
                        <input
                            type="text"
                            value={audioName}
                            onChange={(e) => setAudioName(e.target.value)}
                            placeholder="e.g. History of Auniati Satra"
                            className="w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 
                            dark:border-zinc-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Collection Selection - UPDATED WITH SUB-CATEGORY DISPLAY */}
                    <div>
                        <label className="block mb-2 font-semibold">Collection Category</label>
                        <select
                            value={collectionCategory}
                            onChange={handleCollectionChange}
                            className="w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 
                            dark:border-zinc-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            required
                        >
                            <option value="">Select Collection</option>
                            {collectionCategories.map((cat, index) => (
                                <option key={index} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>

                        {/* Display selected sub-category */}
                        {selectedSubCategory && (
                            <div className="mt-2 flex items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">Selected:</span>
                                <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 
                                dark:text-amber-100 px-3 py-1 rounded-full text-sm">
                                    {selectedSubCategory}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setShowSubCategoryModal(true)}
                                    className="ml-2 text-amber-500 hover:text-amber-600"
                                >
                                    <Edit size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Language Selection */}
                    <div>
                        <label className="block mb-2 font-semibold">Available Languages</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {languages.map((lang, idx) => (
                                <span
                                    key={idx}
                                    className="flex items-center bg-amber-500 text-white px-3 py-1 rounded-full text-sm"
                                >
                                    {lang}
                                    <button
                                        type="button"
                                        className="ml-1 hover:text-red-500"
                                        onClick={() => handleRemoveLanguage(lang)}
                                    >
                                        <X size={16} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={currentLanguage}
                                onChange={(e) => setCurrentLanguage(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 
                                dark:border-zinc-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            >
                                <option value="">Select Language</option>
                                {availableLanguages.map((lang) => (
                                    <option key={lang} value={lang}>
                                        {lang}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={handleAddLanguage}
                                className="px-4 py-2 bg-gray-200 dark:bg-zinc-600 hover:bg-gray-300 
                                dark:hover:bg-zinc-500 rounded-md"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-right">
                        <button
                            type="submit"
                            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg 
                            font-medium transition-colors duration-300"
                        >
                            Save Audio File
                        </button>
                    </div>
                </form>

                {/* Hidden audio element */}
                <audio
                    ref={audioRef}
                    src={audioPreview || undefined}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                />
            </div>
        </div>
    );
};

export default PlayerAdmin;