// src\components\dashboard\AudioPlayerManager.tsx
import React, { useState, useEffect } from "react";
import { Edit2, Trash2, X, Save, Search, Filter, Info } from "lucide-react";
import { getAllAudioPlayerData, updateAudioPlayerData, deleteAudioPlayerData } from "@/actions/player";
import { getCollections } from "@/actions/collections";
import Api from "@/apis/Api";

interface AudioGuide {
    id: string;
    collection_item_id: string;
    english_audio_url: string;
    hindi_audio_url: string;
    assamese_audio_url: string;
    english_description: string;
    hindi_description: string;
    assamese_description: string;
    created_at: string;
    updated_at: string;
}

interface Artifact {
    id: string;
    name: string;
    category: string;
    imageUrl?: string;
    keywords?: string[];
    audio_guide_id?: string | null;  // Add this line
}

const AudioPlayerManager: React.FC = () => {
    const [audioGuides, setAudioGuides] = useState<AudioGuide[]>([]);
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string | null }>({
        show: false,
        id: null,
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<AudioGuide>>({
        english_audio_url: "",
        hindi_audio_url: "",
        assamese_audio_url: "",
        english_description: "",
        hindi_description: "",
        assamese_description: "",
    });
    const [hoveredGuide, setHoveredGuide] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [showToast, setShowToast] = useState(false);

    const triggerToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const getArtifactInfo = (audioGuideId: string) => {
    const artifact = artifacts.find(a => a.audio_guide_id === audioGuideId);
    return artifact || {
        name: "Unknown Artifact",
        category: "Unknown Category",
    };
};

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch audio guides
                const audioData = await getAllAudioPlayerData();
                setAudioGuides(audioData);

                // Fetch artifacts for reference
                const collectionsData = await getCollections();
                // Ensure we're mapping the data correctly
                setArtifacts(collectionsData.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    imageUrl: item.imageUrl,
                    keywords: item.keywords,
                    audio_guide_id: item.audio_guide_id  // Add this line
                })));
            } catch (err) {
                setError("Failed to fetch audio guides");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = (guide: AudioGuide) => {
        setEditingId(guide.id);
        setEditForm({
            english_audio_url: guide.english_audio_url,
            hindi_audio_url: guide.hindi_audio_url,
            assamese_audio_url: guide.assamese_audio_url,
            english_description: guide.english_description,
            hindi_description: guide.hindi_description,
            assamese_description: guide.assamese_description,
        });
    };

    const handleEditSubmit = async () => {
        if (!editingId) return;

        try {
            await updateAudioPlayerData(editingId, editForm);

            setAudioGuides(audioGuides.map(guide =>
                guide.id === editingId ? { ...guide, ...editForm } : guide
            ));

            setEditingId(null);
            triggerToast("Audio guide updated successfully", "success");
        } catch (err) {
            console.error("Update failed:", err);
            triggerToast("Failed to update audio guide", "error");
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteConfirm({ show: true, id });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm.id) return;

        try {
            await deleteAudioPlayerData(deleteConfirm.id);
            setAudioGuides(audioGuides.filter(guide => guide.id !== deleteConfirm.id));
            setDeleteConfirm({ show: false, id: null });
            triggerToast("Audio guide deleted successfully", "success");
        } catch (err) {
            console.error("Delete failed:", err);
            triggerToast("Failed to delete audio guide", "error");
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({
            english_audio_url: "",
            hindi_audio_url: "",
            assamese_audio_url: "",
            english_description: "",
            hindi_description: "",
            assamese_description: "",
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800 dark:border-amber-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded relative max-w-4xl mx-auto mt-8">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
            {/* Toast notification */}
            {showToast && toast && (
                <div
                    className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-sm shadow-lg text-sm max-w-sm ${toast.type === "success"
                        ? "bg-red-800 dark:bg-amber-600 text-white"
                        : "bg-red-900 text-white"
                        } animate-slide-in`}
                >
                    <div className="flex justify-between items-center gap-4">
                        <span>{toast.message}</span>
                        <button onClick={() => setShowToast(false)} className="cursor-pointer">
                            <X size={18} className="hover:text-gray-200" />
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/30 rounded-b-md overflow-hidden">
                        <div className="h-full bg-white animate-progress-bar"></div>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                Audio Guide Manager
            </h2>

            {/* Search Section */}
            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by artifact name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
                    />
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Showing {audioGuides.length} audio guides
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-red-800 dark:border-amber-600">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Confirm Delete</h3>
                            <button
                                onClick={() => setDeleteConfirm({ show: false, id: null })}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p className="mb-6 text-gray-600 dark:text-gray-300">
                            Are you sure you want to delete this audio guide? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirm({ show: false, id: null })}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-900 dark:bg-amber-600 dark:hover:bg-amber-700 text-white transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6 fade-in">
                {audioGuides.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No audio guides found
                    </div>
                ) : (
                    audioGuides.map(guide => {
                        const artifact = getArtifactInfo(guide.id); // Use guide.id to match audio_guide_id
                        return (
                            <div
                                key={guide.id}
                                className="bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 p-6 relative group hover:shadow-lg transition-shadow"
                                onMouseEnter={() => setHoveredGuide(guide.id)}
                                onMouseLeave={() => setHoveredGuide(null)}
                            >
                                {/* Tooltip for hover info */}
                                {hoveredGuide === guide.id && (
                                    <div className="absolute bottom-2 right-2">
                                        <div className="relative">
                                            <Info size={16} className="text-gray-400" />
                                            <div className="absolute bottom-6 right-0 bg-black text-white text-xs rounded-md p-2 whitespace-nowrap z-10">
                                                <div>ID: {guide.id}</div>
                                                <div>Collection Item ID: {guide.collection_item_id}</div>
                                                <div>Created: {new Date(guide.created_at).toLocaleDateString()}</div>
                                                <div>Updated: {new Date(guide.updated_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {editingId === guide.id ? (
                                    // Edit Form
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">Edit Audio Guide</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleEditSubmit}
                                                    className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                                                >
                                                    <Save size={16} />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="flex items-center gap-2 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
                                                >
                                                    <X size={16} />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>

                                        {/* Artifact Info (non-editable) */}
                                        <div className="mb-4 p-4 bg-gray-50 dark:bg-zinc-750 rounded-lg">
                                            <h4 className="font-semibold mb-2">Artifact Information:</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Artifact Name</label>
                                                    <div className="px-3 py-2 bg-gray-100 dark:bg-zinc-700 rounded-md">
                                                        {artifact?.name || "Unknown Artifact"}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Category</label>
                                                    <div className="px-3 py-2 bg-gray-100 dark:bg-zinc-700 rounded-md">
                                                        {artifact?.category || "Unknown Category"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Audio URLs */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">English Audio URL</label>
                                                <input
                                                    type="text"
                                                    value={editForm.english_audio_url || ""}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, english_audio_url: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Hindi Audio URL</label>
                                                <input
                                                    type="text"
                                                    value={editForm.hindi_audio_url || ""}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, hindi_audio_url: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Assamese Audio URL</label>
                                                <input
                                                    type="text"
                                                    value={editForm.assamese_audio_url || ""}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, assamese_audio_url: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Descriptions */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">English Description</label>
                                                <textarea
                                                    rows={5}
                                                    value={editForm.english_description || ""}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, english_description: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Hindi Description</label>
                                                <textarea
                                                    rows={5}
                                                    value={editForm.hindi_description || ""}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, hindi_description: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Assamese Description</label>
                                                <textarea
                                                    rows={5}
                                                    value={editForm.assamese_description || ""}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, assamese_description: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Display Mode
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold">{artifact?.name || "Unknown Artifact"}</h3>
                                                <span className="inline-block mt-2 bg-gray-200 dark:bg-zinc-700 px-3 py-1 rounded-full text-sm font-medium">
                                                    {artifact?.category || "Unknown Category"}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditClick(guide)}
                                                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                                                >
                                                    <Edit2 size={16} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(guide.id)}
                                                    className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        {/* Audio URLs */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div>
                                                <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">English Audio</h4>
                                                <div className="truncate p-2 bg-gray-100 dark:bg-zinc-750 rounded-md text-sm">
                                                    {guide.english_audio_url || "Not provided"}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Hindi Audio</h4>
                                                <div className="truncate p-2 bg-gray-100 dark:bg-zinc-750 rounded-md text-sm">
                                                    {guide.hindi_audio_url || "Not provided"}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Assamese Audio</h4>
                                                <div className="truncate p-2 bg-gray-100 dark:bg-zinc-750 rounded-md text-sm">
                                                    {guide.assamese_audio_url || "Not provided"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Descriptions */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">English Description</h4>
                                                <div className="p-3 bg-gray-50 dark:bg-zinc-750 rounded-md text-sm h-40 overflow-y-auto">
                                                    {guide.english_description || "No description provided"}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Hindi Description</h4>
                                                <div className="p-3 bg-gray-50 dark:bg-zinc-750 rounded-md text-sm h-40 overflow-y-auto">
                                                    {guide.hindi_description || "No description provided"}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Assamese Description</h4>
                                                <div className="p-3 bg-gray-50 dark:bg-zinc-750 rounded-md text-sm h-40 overflow-y-auto">
                                                    {guide.assamese_description || "No description provided"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AudioPlayerManager;