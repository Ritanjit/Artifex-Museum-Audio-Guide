// src/components/dashboard/collectionsManager.tsx
import React, { useState, useEffect } from "react";
import { Edit2, Trash2, X, Save, Search, Filter, Info } from "lucide-react";
import { getCollections, deleteArtifact, updateArtifact } from "@/actions/collections";

interface Artifact {
    id: string;
    name: string;
    category: string;
    keywords: string[];
    imageUrl: string;
    created_at: string;
    updated_at: string;
}

const CollectionsManager: React.FC = () => {
    const [collections, setCollections] = useState<Artifact[]>([]);
    const [filteredCollections, setFilteredCollections] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string | null }>({
        show: false,
        id: null,
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Artifact>>({
        name: "",
        category: "",
        keywords: [],
        imageUrl: "",
    });
    const [currentKeyword, setCurrentKeyword] = useState("");
    const [hoveredArtifact, setHoveredArtifact] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [showFilters, setShowFilters] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [showToast, setShowToast] = useState(false);

    const collectionCategories = [
        "All",
        "Satras",
        "Mukhas",
        "Ahom Dynasty",
        "Folk Traditions",
        "Royal Seals",
        "Language & Scripts",
    ];

    const triggerToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };


    const [showTooltip, setShowTooltip] = useState(true);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                setLoading(true);
                const data = await getCollections();
                setCollections(data);
                setFilteredCollections(data);
            } catch (err) {
                setError("Failed to fetch collections");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, []);

    // Apply search and filter whenever they change
    useEffect(() => {
        let result = collections;

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.name.toLowerCase().includes(term) ||
                item.keywords.some(k => k.toLowerCase().includes(term))
            );
        }

        // Apply category filter
        if (filterCategory !== "All") {
            result = result.filter(item => item.category === filterCategory);
        }

        setFilteredCollections(result);
    }, [searchTerm, filterCategory, collections]);

    const handleDeleteClick = (id: string) => {
        setDeleteConfirm({ show: true, id });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm.id) return;

        try {
            await deleteArtifact(deleteConfirm.id);
            setCollections(collections.filter(item => item.id !== deleteConfirm.id));
            setDeleteConfirm({ show: false, id: null });
            triggerToast("Artifact deleted successfully", "success");
        } catch (err) {
            console.error("Delete failed:", err);
            triggerToast("Failed to delete artifact", "error");
        }
    };

    const handleEditClick = (artifact: Artifact) => {
        setEditingId(artifact.id);
        setEditForm({
            name: artifact.name,
            category: artifact.category,
            keywords: [...artifact.keywords],
            imageUrl: artifact.imageUrl,
        });
        setShowTooltip(false); // Hide tooltip when editing
    };

    // Update the handleEditSubmit function
    const handleEditSubmit = async () => {
        if (!editingId) return;

        try {
            // Call updateArtifact with the correct parameters
            await updateArtifact(editingId, {
                name: editForm.name || "",
                category: editForm.category || "",
                keywords: editForm.keywords || [],
                imageUrl: editForm.imageUrl || "",
            });

            setCollections(collections.map(item =>
                item.id === editingId ? {
                    ...item,
                    name: editForm.name || "",
                    category: editForm.category || "",
                    keywords: editForm.keywords || [],
                    imageUrl: editForm.imageUrl || "",
                } : item
            ));

            setEditingId(null);
            triggerToast("Artifact updated successfully", "success");
        } catch (err) {
            console.error("Update failed:", err);
            triggerToast("Failed to update artifact", "error");
        }
    };

    const handleAddKeyword = () => {
        if (currentKeyword.trim() && !editForm.keywords?.includes(currentKeyword.trim())) {
            setEditForm(prev => ({
                ...prev,
                keywords: [...(prev.keywords || []), currentKeyword.trim()]
            }));
            setCurrentKeyword("");
        }
    };

    const handleRemoveKeyword = (keyword: string) => {
        setEditForm(prev => ({
            ...prev,
            keywords: prev.keywords?.filter(k => k !== keyword) || []
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddKeyword();
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: "", category: "", keywords: [], imageUrl: "" });
        setCurrentKeyword("");
        setShowTooltip(true); // Show tooltip again when canceling edit
    };

    const resetFilters = () => {
        setSearchTerm("");
        setFilterCategory("All");
        setShowFilters(false);
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
                Manage Collections
            </h2>

            {/* Search and Filter Section */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-lg transition-colors"
                        >
                            <Filter size={18} />
                            Filters
                        </button>

                        {(searchTerm || filterCategory !== "All") && (
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-lg transition-colors"
                            >
                                <X size={18} />
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-zinc-750 rounded-lg">
                        <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Filter by Category</h3>
                        <div className="flex flex-wrap gap-2">
                            {collectionCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-3 py-1.5 rounded-full text-sm ${filterCategory === cat
                                        ? "bg-red-800 dark:bg-amber-600 text-white"
                                        : "bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600"
                                        } transition-colors`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredCollections.length} of {collections.length} artifacts
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
                            Are you sure you want to delete this artifact? This action cannot be undone.
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
                {filteredCollections.length === 0 && !loading ? (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No artifacts found matching your criteria
                    </div>
                ) : (
                    filteredCollections.map(artifact => (
                        <div
                            key={artifact.id}
                            className="bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 p-6 relative group hover:shadow-lg transition-shadow"
                            onMouseEnter={() => setHoveredArtifact(artifact.id)}
                            onMouseLeave={() => setHoveredArtifact(null)}
                        >
                            {/* Tooltip for hover info - Conditionally render tooltip only when not editing and showTooltip is true */}
                            {showTooltip && !editingId && (
                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="relative">
                                        <Info size={16} className="text-gray-400" />
                                        <div className="absolute bottom-6 right-0 bg-black text-white text-xs rounded-md p-2 whitespace-nowrap z-10">
                                            <div>Item ID: {artifact.id}</div>
                                            <div>Created On: {new Date(artifact.created_at).toLocaleDateString()}</div>
                                            <div>Last Updated On: {new Date(artifact.updated_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {editingId === artifact.id ? (
                                // Edit Form
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Edit Collection</h3>
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Name</label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Category</label>
                                            <select
                                                value={editForm.category}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
                                            >
                                                <option value="">Select Category</option>
                                                {collectionCategories.filter(c => c !== "All").map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Image URL</label>
                                            <input
                                                type="text"
                                                value={editForm.imageUrl}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Keywords <span className="text-xs text-gray-500">(press Enter to add)</span>
                                            </label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {editForm.keywords?.map(keyword => (
                                                    <span
                                                        key={keyword}
                                                        className="flex items-center bg-red-800 dark:bg-amber-600 text-white px-2 py-1 rounded-full text-sm"
                                                    >
                                                        {keyword}
                                                        <button
                                                            type="button"
                                                            className="ml-1 hover:text-red-300 dark:hover:text-amber-300"
                                                            onClick={() => handleRemoveKeyword(keyword)}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                value={currentKeyword}
                                                onChange={(e) => setCurrentKeyword(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Type keyword and press Enter"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Display Mode
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-24 h-24 bg-gray-200 dark:bg-zinc-700 rounded-md overflow-hidden flex items-center justify-center">
                                            {artifact.imageUrl ? (
                                                <img
                                                    src={artifact.imageUrl}
                                                    alt={artifact.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Im0xNSAxMi0zLTMtMy0zdjZsMy0zWiIgZmlsbD0iIzlmYTZiMiIvPgo8L3N2Zz4K";
                                                    }}
                                                />
                                            ) : (
                                                <div className="text-gray-400 dark:text-zinc-500">
                                                    <span className="text-xs">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-semibold">{artifact.name}</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditClick(artifact)}
                                                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                                                >
                                                    <Edit2 size={16} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(artifact.id)}
                                                    className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <span className="inline-block bg-gray-200 dark:bg-zinc-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {artifact.category}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <div className="flex flex-wrap gap-2">
                                                {artifact.keywords?.map(keyword => (
                                                    <span
                                                        key={keyword}
                                                        className="bg-red-100 dark:bg-amber-900 text-red-800 dark:text-amber-200 px-2 py-1 rounded-md text-sm"
                                                    >
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            <div className="truncate">
                                                <strong>URL:</strong> {artifact.imageUrl}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CollectionsManager;