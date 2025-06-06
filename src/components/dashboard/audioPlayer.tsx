// src/components/PlayerAdmin.tsx
import React, {
    useState,
    useEffect,
    useRef,
    ChangeEvent,
} from "react";
import {
    X,
    Play,
    Pause,
    Trash2,
    Upload,
    Volume2,
    VolumeX,
    PlusCircle,
    CloudUpload,
    Loader2,
} from "lucide-react";
import { getCollections } from "@/actions/collections";
import { uploadAudio } from "@/apis/audio";

// --- Types ---
interface AudioFile {
    id: string;
    language: string;
    previewUrl: string;
    fileName: string;
    fileObject?: File; // Added for upload
    backendUrl?: string; // Added for cloud URL
}

interface ArtifactRow {
    id: string;
    name: string;
    category: string;
}

interface ArtifactData {
    id: string;
    collectionCategory: string;
    artifactName: string;
    audioFiles: AudioFile[];
}

// --- Constants ---
const AVAILABLE_LANGUAGES = ["Assamese", "Hindi", "English"];

const PlayerAdmin: React.FC = () => {
    // Holds dynamic list of all (id, name, category) from FrontQL
    const [artifactRows, setArtifactRows] = useState<ArtifactRow[]>([]);

    // Each "artifact" block in the form:
    const [artifacts, setArtifacts] = useState<ArtifactData[]>([
        {
            id: Date.now().toString(),
            collectionCategory: "",
            artifactName: "",
            audioFiles: [],
        },
    ]);

    const [currentArtifactId, setCurrentArtifactId] = useState<string | null>(
        null
    );
    const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [toast, setToast] = useState<
        { message: string; type: "success" | "error" } | null
    >(null);
    const [showToast, setShowToast] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // State for tracking upload progress
    const [uploadingStates, setUploadingStates] = useState<{
        [key: string]: {
            progress: number;
            isUploading: boolean;
            backendUrl: string | null;
        };
    }>({});

    // --- Toast ---
    const triggerToast = (
        message: string,
        type: "success" | "error" = "success"
    ) => {
        setToast({ message, type });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    // --- Time formatting ---
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // --- Fetch collection categories & artifact names from FrontQL ---
    useEffect(() => {
        const fetchAllRows = async () => {
            try {
                const rows = await getCollections();
                const simplified = rows.map((r) => ({
                    id: r.id.toString(),
                    name: r.name,
                    category: r.category,
                }));
                setArtifactRows(simplified);
            } catch (err) {
                console.error("Error loading collections for dropdown:", err);
                triggerToast("Failed to load collections from server", "error");
            }
        };
        fetchAllRows();
    }, []);

    // --- Audio Upload Handler ---
    const handleAudioUpload = (
        e: ChangeEvent<HTMLInputElement>,
        language: string,
        artifactId: string
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const url = URL.createObjectURL(file);

        // Generate a unique key for this upload
        const uploadKey = `${artifactId}_${language}`;

        setUploadingStates(prev => ({
            ...prev,
            [uploadKey]: {
                progress: 0,
                isUploading: false,
                backendUrl: null,
            },
        }));

        setArtifacts((prev) =>
            prev.map((artifact) => {
                if (artifact.id === artifactId) {
                    const updated = artifact.audioFiles.filter(
                        (f) => f.language !== language
                    );
                    const newEntry: AudioFile = {
                        id: Math.random().toString(36).substring(2, 9),
                        language,
                        previewUrl: url,
                        fileName: file.name,
                        fileObject: file, // Store file for upload
                    };
                    return {
                        ...artifact,
                        audioFiles: [...updated, newEntry],
                    };
                }
                return artifact;
            })
        );

        if (!currentLanguage) {
            setCurrentLanguage(language);
            setCurrentArtifactId(artifactId);
            setIsPlaying(true);
        }
    };

    // Handle audio upload to cloud
    const handleUploadToCloud = async (artifactId: string, language: string) => {
        const artifact = artifacts.find(a => a.id === artifactId);
        if (!artifact) return;

        const file = artifact.audioFiles.find(f => f.language === language);
        if (!file || !file.fileObject) return;

        const uploadKey = `${artifactId}_${language}`;

        try {
            // Update upload state
            setUploadingStates(prev => ({
                ...prev,
                [uploadKey]: {
                    ...prev[uploadKey],
                    isUploading: true,
                    progress: 0,
                },
            }));

            // Upload to cloud
            const folder = "artifex/audio";
            const result = await uploadAudio(
                file.fileObject,
                folder,
                (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadingStates(prev => ({
                            ...prev,
                            [uploadKey]: {
                                ...prev[uploadKey],
                                progress,
                            },
                        }));
                    }
                }
            );

            const fullUrl = import.meta.env.VITE_AUDIO_URL + result;

            // Update upload state with backend URL
            setUploadingStates(prev => ({
                ...prev,
                [uploadKey]: {
                    ...prev[uploadKey],
                    backendUrl: fullUrl,
                    isUploading: false,
                },
            }));

            // Update the artifact with backend URL
            setArtifacts(prev =>
                prev.map(a => {
                    if (a.id === artifactId) {
                        return {
                            ...a,
                            audioFiles: a.audioFiles.map(f => {
                                if (f.language === language) {
                                    return { ...f, backendUrl: fullUrl };
                                }
                                return f;
                            }),
                        };
                    }
                    return a;
                })
            );
        } catch (error) {
            console.error("Audio upload failed:", error);
            setUploadingStates(prev => ({
                ...prev,
                [uploadKey]: {
                    ...prev[uploadKey],
                    isUploading: false,
                },
            }));
            triggerToast(
                `Failed to upload ${file.fileName}`,
                "error"
            );
        }
    };

    const handleRemoveFile = (language: string, artifactId: string) => {
        setArtifacts((prev) =>
            prev.map((artifact) => {
                if (artifact.id === artifactId) {
                    return {
                        ...artifact,
                        audioFiles: artifact.audioFiles.filter((f) => f.language !== language),
                    };
                }
                return artifact;
            })
        );
        
        // Clear upload state
        const uploadKey = `${artifactId}_${language}`;
        setUploadingStates(prev => {
            const newState = { ...prev };
            delete newState[uploadKey];
            return newState;
        });
        
        if (currentLanguage === language && currentArtifactId === artifactId) {
            setCurrentLanguage(null);
            setCurrentArtifactId(null);
            setIsPlaying(false);
        }
    };

    const handleLanguageClick = (language: string, artifactId: string) => {
        if (artifactId === currentArtifactId && language === currentLanguage) {
            setIsPlaying((prev) => !prev);
        } else {
            setCurrentArtifactId(artifactId);
            setCurrentLanguage(language);
            setIsPlaying(true);
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        if (audioRef.current) {
            audioRef.current.volume = newVol;
            audioRef.current.muted = newVol === 0;
            setIsMuted(newVol === 0);
        }
    };

    // --- Add / Remove Artifact Blocks ---
    const addArtifact = () => {
        setArtifacts((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                collectionCategory: "",
                artifactName: "",
                audioFiles: [],
            },
        ]);
    };

    const removeArtifact = (id: string) => {
        if (artifacts.length === 1) {
            triggerToast("At least one artifact is required", "error");
            return;
        }

        setArtifacts((prev) => prev.filter((artifact) => artifact.id !== id));
        if (currentArtifactId === id) {
            setCurrentArtifactId(null);
            setCurrentLanguage(null);
            setIsPlaying(false);
        }
    };

    // --- Submit Form ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        for (const artifact of artifacts) {
            if (!artifact.artifactName || !artifact.collectionCategory) {
                triggerToast("Please fill all required fields", "error");
                return;
            }
            if (artifact.audioFiles.length === 0) {
                triggerToast("Please upload at least one audio file per artifact!", "error");
                return;
            }
        }

        console.log("Submitted artifacts:", artifacts);
        triggerToast("Audio collections saved successfully!", "success");

        // Reset form to one empty artifact
        setArtifacts([
            { id: Date.now().toString(), collectionCategory: "", artifactName: "", audioFiles: [] },
        ]);
        setCurrentArtifactId(null);
        setCurrentLanguage(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setVolume(0.7);
        setIsMuted(false);
    };

    // --- Sync audio player ---
    useEffect(() => {
        if (!audioRef.current || !currentArtifactId || !currentLanguage) return;

        const artifact = artifacts.find((a) => a.id === currentArtifactId);
        if (!artifact) return;

        const file = artifact.audioFiles.find((f) => f.language === currentLanguage);
        if (!file) return;

        // Change source only if needed
        if (audioRef.current.src !== file.previewUrl) {
            audioRef.current.src = file.previewUrl;
            audioRef.current.load();
        }

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
    }, [currentArtifactId, currentLanguage, isPlaying, artifacts]);

    const handleTimeUpdate = () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
    };

    const handleEnded = () => setIsPlaying(false);

    const currentArtifact = artifacts.find((a) => a.id === currentArtifactId);
    const currentAudioFile = currentArtifact?.audioFiles.find(
        (f) => f.language === currentLanguage
    );

    // --- Derive unique categories from artifactRows ---
    const uniqueCategories = Array.from(
        new Set(artifactRows.map((r) => r.category))
    );

    // Given a category, list artifact names under that category
    const artifactNamesForCategory = (category: string) =>
        artifactRows
            .filter((r) => r.category === category)
            .map((r) => r.name);

    return (
        <div className="w-full min-h-screen py-8 bg-gray-100 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            {showToast && toast && (
                <div
                    className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-sm shadow-lg text-sm max-w-sm ${toast.type === "success"
                            ? "bg-red-800 dark:bg-amber-600 text-white"
                            : "bg-red-900 text-white"
                        }`}
                >
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

            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Audio Guide Management</h2>
                    <button
                        type="button"
                        onClick={addArtifact}
                        className="flex items-center gap-2 bg-red-800 hover:bg-red-900 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
                    >
                        <PlusCircle size={20} />
                        <span>Add Artifact</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {artifacts.map((artifact, index) => (
                        <div
                            key={artifact.id}
                            className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md mb-8 relative border border-gray-200 dark:border-zinc-700"
                        >
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-zinc-700">
                                <h3 className="text-xl font-semibold">Artifact {index + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeArtifact(artifact.id)}
                                    className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                                    title="Remove artifact"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            {/* Category & Artifact Dropdowns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block mb-2 font-medium">
                                        Collection Category *
                                    </label>
                                    <select
                                        value={artifact.collectionCategory}
                                        onChange={(e) => {
                                            const cat = e.target.value;
                                            setArtifacts((prev) =>
                                                prev.map((a) =>
                                                    a.id === artifact.id
                                                        ? { ...a, collectionCategory: cat, artifactName: "" }
                                                        : a
                                                )
                                            );
                                        }}
                                        className="w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {uniqueCategories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Artifact Name *
                                    </label>
                                    <select
                                        value={artifact.artifactName}
                                        onChange={(e) =>
                                            setArtifacts((prev) =>
                                                prev.map((a) =>
                                                    a.id === artifact.id
                                                        ? { ...a, artifactName: e.target.value }
                                                        : a
                                                )
                                            )
                                        }
                                        disabled={!artifact.collectionCategory}
                                        className="w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
                                        required
                                    >
                                        <option value="">Select Artifact</option>
                                        {artifact.collectionCategory &&
                                            artifactNamesForCategory(artifact.collectionCategory).map(
                                                (name) => (
                                                    <option key={name} value={name}>
                                                        {name}
                                                    </option>
                                                )
                                            )}
                                    </select>
                                </div>
                            </div>

                            {/* Upload per language */}
                            <div>
                                <h3 className="text-lg font-medium mb-4">
                                    Upload Audio (Max 3 Languages)
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {AVAILABLE_LANGUAGES.map((language) => {
                                        const file = artifact.audioFiles.find(
                                            (f) => f.language === language
                                        );
                                        const isCurrent =
                                            currentArtifactId === artifact.id &&
                                            currentLanguage === language;

                                        const uploadKey = `${artifact.id}_${language}`;
                                        const uploadState = uploadingStates[uploadKey];

                                        return (
                                            <div
                                                key={language}
                                                className={`border-2 rounded-lg p-4 ${isCurrent
                                                        ? "border-red-800 dark:border-amber-600 bg-red-50 dark:bg-amber-900/20"
                                                        : "border-dashed border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="font-medium">{language}</span>
                                                    {file && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveFile(language, artifact.id)
                                                            }
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>

                                                {file ? (
                                                    <div className="space-y-3">
                                                        <div
                                                            className="text-sm truncate text-gray-600 dark:text-gray-300"
                                                            title={file.fileName}
                                                        >
                                                            {file.fileName}
                                                        </div>

                                                        {/* Upload to Cloud section */}
                                                        {!file.backendUrl && (
                                                            <div className="mt-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleUploadToCloud(artifact.id, language)}
                                                                    disabled={uploadState?.isUploading}
                                                                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-md ${uploadState?.isUploading
                                                                            ? "bg-gray-400 cursor-not-allowed"
                                                                            : "bg-red-800 hover:bg-red-700 dark:bg-amber-600 dark:hover:bg-amber-500 text-white"
                                                                        }`}
                                                                >
                                                                    {uploadState?.isUploading ? (
                                                                        <>
                                                                            <Loader2 size={16} className="animate-spin" />
                                                                            Uploading... {uploadState.progress}%
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <CloudUpload size={16} />
                                                                            Upload to Cloud
                                                                        </>
                                                                    )}
                                                                </button>
                                                                {uploadState?.isUploading && (
                                                                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded overflow-hidden">
                                                                        <div
                                                                            className="bg-red-800 dark:bg-amber-500 h-full transition-all duration-200"
                                                                            style={{ width: `${uploadState.progress}%` }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Backend URL input */}
                                                        {(file.backendUrl || uploadState?.backendUrl) && (
                                                            <div className="mt-2">
                                                                <input
                                                                    type="text"
                                                                    value={file.backendUrl || uploadState?.backendUrl || ""}
                                                                    readOnly
                                                                    className="w-full px-2 py-1 text-xs bg-gray-100 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded"
                                                                    onClick={(e) => e.currentTarget.select()}
                                                                />
                                                                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                                                                    Audio URL
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Play button */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleLanguageClick(language, artifact.id)
                                                            }
                                                            className={`flex items-center justify-center w-full py-2 rounded-md ${isCurrent && isPlaying
                                                                    ? "bg-red-800 dark:bg-amber-600 text-white"
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
                                                            <Upload
                                                                size={24}
                                                                className="text-red-800 dark:text-amber-600 mb-2"
                                                            />
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                Upload Audio
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept="audio/*"
                                                            onChange={(e) =>
                                                                handleAudioUpload(e, language, artifact.id)
                                                            }
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Save button ONLY on the last artifact block */}
                            {index === artifacts.length - 1 && (
                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-zinc-700 flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-red-800 hover:bg-red-900 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Upload size={18} />
                                        <span>Save Audio Collection</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Audio Player */}
                    {currentAudioFile && (
                        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700">
                            <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">
                                        {currentArtifact?.artifactName} - {currentAudioFile.fileName}
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            type="button"
                                            onClick={toggleMute}
                                            className="text-gray-600 dark:text-gray-300 hover:text-red-800 dark:hover:text-amber-600"
                                        >
                                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                        </button>
                                        <div className="flex items-center w-32">
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={isMuted ? 0 : volume}
                                                onChange={handleVolumeChange}
                                                className="w-full h-2 bg-gray-300 dark:bg-zinc-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-800 dark:[&::-webkit-slider-thumb]:bg-amber-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
                                        {formatTime(currentTime)}
                                    </span>
                                    <div className="relative flex-1">
                                        <input
                                            type="range"
                                            min="0"
                                            max={duration || 100}
                                            step="0.01"
                                            value={currentTime}
                                            onChange={handleSeek}
                                            className="w-full h-2 bg-gray-300 dark:bg-zinc-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-800 dark:[&::-webkit-slider-thumb]:bg-amber-600"
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
                                        {formatTime(duration)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                {/* Hidden Audio Element */}
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