// Updated src/components/dashboard/newsAdmin.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit3, Trash2, Star, StarOff, ChevronDown, Save, X, AlertCircle, CheckCircle, LayoutGrid, List, Calendar, Clock, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getAllNews, createNews, updateNews, deleteNews } from '@/actions/news';

interface NewsItem {
    id: string;
    headline: string;
    excerpt: string;
    category: 'discovery' | 'exhibition' | 'workshop' | 'cultural' | 'research';
    featured: boolean;
    tags: string[];
    date: Date;
    updated_at: Date; // Changed from lastUpdated to updated_at
}

const NewsAdmin: React.FC = () => {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
    const [isAddingNews, setIsAddingNews] = useState(false);
    const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [newNews, setNewNews] = useState<Omit<NewsItem, 'id' | 'updated_at'>>({
        headline: '',
        excerpt: '',
        category: 'discovery',
        featured: false,
        tags: [],
        date: new Date()
    });

const categories = [
        { value: 'all', label: 'All Categories', color: 'bg-gray-100 dark:bg-gray-700' },
        { value: 'achievements', label: 'Achievements', color: 'bg-emerald-100 dark:bg-emerald-900/30' },
        { value: 'exhibition', label: 'Exhibitions', color: 'bg-blue-100 dark:bg-blue-900/30' },
        { value: 'workshop', label: 'Workshops', color: 'bg-purple-100 dark:bg-purple-900/30' },
        { value: 'cultural', label: 'Cultural', color: 'bg-orange-100 dark:bg-orange-900/30' },
        { value: 'lastest news', label: 'Latest News', color: 'bg-cyan-100 dark:bg-cyan-900/30' },
    ];

    // Fetch news from API
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await getAllNews();
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format received from API');
                }

                const formattedData = data.map((item: any) => ({
                    ...item,
                    date: safeParseDate(item.date),
                    updated_at: safeParseDate(item.updated_at)
                }));

                setNewsItems(formattedData);
                setFilteredNews(formattedData);
            } catch (error) {
                console.error('Failed to fetch news:', error);
                showToast('Failed to load news articles', 'error');
                setNewsItems([]);
                setFilteredNews([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, []);

    // Show toast notification
    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Filter and sort news
    useEffect(() => {
        let filtered = newsItems;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        // Sort
        filtered.sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case 'date':
                    aValue = a.date.getTime();
                    bValue = b.date.getTime();
                    break;
                case 'title':
                    aValue = a.headline.toLowerCase();
                    bValue = b.headline.toLowerCase();
                    break;
                default:
                    aValue = a.date.getTime();
                    bValue = b.date.getTime();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredNews(filtered);
    }, [searchTerm, selectedCategory, sortBy, sortOrder, newsItems]);

    // Handle adding news
    const handleAddNews = async () => {
        if (!newNews.headline?.trim() || !newNews.excerpt?.trim()) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        try {
            const response = await createNews(newNews);
            // Ensure dates are properly parsed
            const createdNews = {
                ...response,
                date: response.date ? new Date(response.date) : new Date(),
                updated_at: response.updated_at ? new Date(response.updated_at) : new Date()
            };
            setNewsItems([...newsItems, createdNews]);
            setNewNews({
                headline: '',
                excerpt: '',
                category: 'discovery',
                featured: false,
                tags: [],
                date: new Date()
            });
            setIsAddingNews(false);
            showToast('News article created successfully');
        } catch (error) {
            console.error('Failed to create news:', error);
            showToast('Failed to create news article', 'error');
        }
    };

    // Handle editing news
    const handleEditNews = (news: NewsItem) => {
        setEditingNews(news);
    };

    const handleUpdateNews = async () => {
        if (!editingNews) return;

        try {
            const updatedData = {
                headline: editingNews.headline,
                excerpt: editingNews.excerpt,
                category: editingNews.category,
                featured: editingNews.featured,
                tags: editingNews.tags,
                date: editingNews.date
            };

            const response = await updateNews(editingNews.id, updatedData);
            // Ensure dates are properly parsed
            const updatedNews = {
                ...editingNews,
                date: response.date ? new Date(response.date) : new Date(),
                updated_at: response.updated_at ? new Date(response.updated_at) : new Date()
            };

            setNewsItems(newsItems.map(item =>
                item.id === editingNews.id ? updatedNews : item
            ));
            setEditingNews(null);
            showToast('News article updated successfully');
        } catch (error) {
            console.error('Failed to update news:', error);
            showToast('Failed to update news article', 'error');
        }
    };

    // Handle deleting news
    const handleDeleteNews = async (id: string) => {
        try {
            await deleteNews(id);
            setNewsItems(newsItems.filter(item => item.id !== id));
            showToast('News article deleted');
        } catch (error) {
            console.error('Failed to delete news:', error);
            showToast('Failed to delete news article', 'error');
        }
    };

    // Handle bulk delete
    const handleBulkAction = async (action: 'delete') => {
        if (selectedItems.length === 0) return;

        try {
            if (action === 'delete') {
                // Delete each item sequentially
                for (const id of selectedItems) {
                    await deleteNews(id);
                }
                setNewsItems(newsItems.filter(item => !selectedItems.includes(item.id)));
                showToast(`${selectedItems.length} articles deleted`);
            }
            setSelectedItems([]);
            setShowBulkActions(false);
        } catch (error) {
            console.error('Bulk action failed:', error);
            showToast('Bulk operation failed', 'error');
        }
    };

    const safeParseDate = (dateString: string | Date | undefined | null): Date => {
        if (!dateString) return new Date();
        if (dateString instanceof Date) return dateString;

        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date() : date;
    };

    const getCategoryColor = (category: string) => {
        const cat = categories.find(c => c.value === category);
        return cat?.color || 'bg-gray-100 dark:bg-gray-700';
    };

    const formatDate = (date: Date | string | undefined | null) => {
        const parsedDate = safeParseDate(date);
        return parsedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Toggle item selection
    const toggleItemSelection = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    // Toggle all items selection
    const toggleAllSelection = () => {
        if (selectedItems.length === filteredNews.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredNews.map(item => item.id));
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f1d1d] dark:border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading news articles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white max-w-sm ${toast.type === 'success' ? 'bg-green-600' :
                    toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                    }`}>
                    <div className="flex items-center gap-2">
                        {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                        {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-[#7f1d1d] to-[#991b1b] dark:from-amber-600 dark:to-amber-700 rounded-xl">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">News Administration</h1>
                                <p className="text-gray-600 dark:text-gray-400">Manage museum news and announcements</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {selectedItems.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {selectedItems.length} selected
                                    </span>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowBulkActions(!showBulkActions)}
                                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            Bulk Actions
                                            <ChevronDown className="w-4 h-4 ml-2 inline" />
                                        </button>

                                        {showBulkActions && (
                                            <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[160px] z-10">
                                                <button
                                                    onClick={() => handleBulkAction('delete')}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setIsAddingNews(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] dark:from-amber-600 dark:to-amber-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                            >
                                <Plus className="w-5 h-5" />
                                Add News
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search news..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Articles</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{newsItems.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Featured</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {newsItems.filter(item => item.featured).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* News List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                News Articles ({filteredNews.length})
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#7f1d1d] dark:bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#7f1d1d] dark:bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {filteredNews.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No articles found</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Try adjusting your search or filter criteria.
                                </p>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredNews.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(item.category)}`}>
                                                        {categories.find(c => c.value === item.category)?.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {item.featured ? (
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-200" />
                                                    ) : (
                                                        <StarOff className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2">
                                                    {item.headline}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                                                    {item.excerpt}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-center mt-4">
                                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{formatDate(item.date)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{formatDistanceToNow(new Date(item.updated_at), { addSuffix: true })}</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditNews(item)}
                                                        className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteNews(item.id)}
                                                        className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="py-3 px-4 w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.length === filteredNews.length && filteredNews.length > 0}
                                                    onChange={toggleAllSelection}
                                                    className="h-4 w-4 rounded border-gray-300 text-[#7f1d1d] dark:text-amber-600 focus:ring-[#7f1d1d] dark:focus:ring-amber-500"
                                                />
                                            </th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Headline
                                            </th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredNews.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(item.id)}
                                                        onChange={() => toggleItemSelection(item.id)}
                                                        className="h-4 w-4 rounded border-gray-300 text-[#7f1d1d] dark:text-amber-600 focus:ring-[#7f1d1d] dark:focus:ring-amber-500"
                                                    />
                                                </td>
                                                <td className="py-3 px-4 max-w-xs">
                                                    <div className="flex items-center gap-3">
                                                        {item.featured && (
                                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-200" />
                                                        )}
                                                        <div>
                                                            <div className="font-medium text-gray-900 dark:text-white line-clamp-1">
                                                                {item.headline}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                                                {item.excerpt}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(item.category)}`}>
                                                        {categories.find(c => c.value === item.category)?.label}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDate(item.date)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditNews(item)}
                                                            className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteNews(item.id)}
                                                            className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add News Modal */}
            {isAddingNews && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add News Article</h3>
                                <button
                                    onClick={() => setIsAddingNews(false)}
                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Headline *
                                    </label>
                                    <input
                                        type="text"
                                        value={newNews.headline}
                                        onChange={(e) => setNewNews({ ...newNews, headline: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Enter headline"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={newNews.category}
                                        onChange={(e) => setNewNews({ ...newNews, category: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        {categories.filter(c => c.value !== 'all').map(cat => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    value={newNews.excerpt}
                                    onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter excerpt"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={safeParseDate(newNews.date).toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        const date = new Date(e.target.value);
                                        if (!isNaN(date.getTime())) {
                                            setNewNews({ ...newNews, date });
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    value={newNews.tags?.join(', ')}
                                    onChange={(e) => setNewNews({ ...newNews, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter tags"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={newNews.featured}
                                    onChange={(e) => setNewNews({ ...newNews, featured: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300 text-[#7f1d1d] dark:text-amber-600 focus:ring-[#7f1d1d] dark:focus:ring-amber-500"
                                />
                                <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Mark as Featured
                                </label>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <button
                                onClick={() => setIsAddingNews(false)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddNews}
                                className="px-4 py-2 bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] dark:from-amber-600 dark:to-amber-700 text-white rounded-lg hover:shadow-lg"
                            >
                                Add News
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit News Modal */}
            {editingNews && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit News Article</h3>
                                <button
                                    onClick={() => setEditingNews(null)}
                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Headline *
                                    </label>
                                    <input
                                        type="text"
                                        value={editingNews.headline}
                                        onChange={(e) => setEditingNews({ ...editingNews, headline: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Enter headline"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={editingNews.category}
                                        onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        {categories.filter(c => c.value !== 'all').map(cat => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Excerpt *
                                </label>
                                <textarea
                                    value={editingNews.excerpt}
                                    onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter excerpt"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={safeParseDate(editingNews?.date).toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        const date = new Date(e.target.value);
                                        if (!isNaN(date.getTime())) {
                                            setEditingNews({ ...editingNews, date });
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    value={editingNews.tags?.join(', ')}
                                    onChange={(e) => setEditingNews({ ...editingNews, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter tags"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={editingNews.featured}
                                    onChange={(e) => setEditingNews({ ...editingNews, featured: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300 text-[#7f1d1d] dark:text-amber-600 focus:ring-[#7f1d1d] dark:focus:ring-amber-500"
                                />
                                <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Mark as Featured
                                </label>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <button
                                onClick={() => setEditingNews(null)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateNews}
                                className="px-4 py-2 bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] dark:from-amber-600 dark:to-amber-700 text-white rounded-lg hover:shadow-lg"
                            >
                                Update News Article
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsAdmin;