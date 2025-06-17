import React, { useState, useEffect } from 'react';
import {
    Clock,
    ChevronRight,
    TrendingUp,
    Calendar,
    Search,
    Filter,
    Eye,
    ExternalLink,
    BookOpen,
    Star,
    Timer,
    Users
} from 'lucide-react';

interface NewsItem {
    id: string;
    headline: string;
    date: Date;
    category: 'discovery' | 'exhibition' | 'workshop' | 'cultural' | 'research';
    priority: 'high' | 'medium' | 'low';
    readTime: number;
    views: number;
    excerpt: string;
    featured: boolean;
}

const LatestNewsBulletin: React.FC = () => {
    const [newsItems] = useState<NewsItem[]>([
        {
            id: '1',
            headline: 'Rare 15th Century Ahom Manuscript Discovered in Majuli',
            date: new Date('2025-06-15'),
            category: 'discovery',
            priority: 'high',
            readTime: 5,
            views: 1247,
            excerpt: 'Archaeologists have uncovered a pristine manuscript containing ancient Tai Ahom scripts and illustrations...',
            featured: true
        },
        {
            id: '2',
            headline: 'Interactive Digital Archive Launch: Exploring Ahom Heritage',
            date: new Date('2025-06-12'),
            category: 'exhibition',
            priority: 'high',
            readTime: 3,
            views: 892,
            excerpt: 'Experience centuries of Ahom history through our new immersive digital platform...',
            featured: true
        },
        {
            id: '3',
            headline: 'Traditional Calligraphy Workshop: Master the Art of Tai Ahom',
            date: new Date('2025-06-10'),
            category: 'workshop',
            priority: 'medium',
            readTime: 4,
            views: 634,
            excerpt: 'Learn from renowned calligraphy masters in this hands-on workshop series...',
            featured: false
        },
        {
            id: '4',
            headline: 'Royal Seal Collection: New Acquisitions from Private Donors',
            date: new Date('2025-06-08'),
            category: 'cultural',
            priority: 'medium',
            readTime: 6,
            views: 445,
            excerpt: 'Three rare royal seals from the Ahom dynasty have been generously donated to our collection...',
            featured: false
        },
        {
            id: '5',
            headline: 'Research Collaboration: Oxford University Partnership Announced',
            date: new Date('2025-06-05'),
            category: 'research',
            priority: 'high',
            readTime: 7,
            views: 1156,
            excerpt: 'A groundbreaking partnership will advance digital preservation of ancient manuscripts...',
            featured: false
        },
        {
            id: '6',
            headline: 'Community Outreach: Mobile Museum Visits Rural Schools',
            date: new Date('2025-06-03'),
            category: 'cultural',
            priority: 'low',
            readTime: 3,
            views: 298,
            excerpt: 'Bringing Ahom heritage education directly to students across Assam...',
            featured: false
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [filteredNews, setFilteredNews] = useState<NewsItem[]>(newsItems);

    const categories = [
        { value: 'all', label: 'All News', color: 'bg-gray-100 dark:bg-gray-700' },
        { value: 'discovery', label: 'Discoveries', color: 'bg-emerald-100 dark:bg-emerald-900/30' },
        { value: 'exhibition', label: 'Exhibitions', color: 'bg-blue-100 dark:bg-blue-900/30' },
        { value: 'workshop', label: 'Workshops', color: 'bg-purple-100 dark:bg-purple-900/30' },
        { value: 'cultural', label: 'Cultural', color: 'bg-orange-100 dark:bg-orange-900/30' },
        { value: 'research', label: 'Research', color: 'bg-cyan-100 dark:bg-cyan-900/30' }
    ];

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': return <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />;
            case 'medium': return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
            default: return <Timer className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
        }
    };

    const getCategoryColor = (category: string) => {
        const cat = categories.find(c => c.value === category);
        return cat?.color || 'bg-gray-100 dark:bg-gray-700';
    };

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Filter news based on search and category
    useEffect(() => {
        let filtered = newsItems;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        setFilteredNews(filtered);
    }, [searchTerm, selectedCategory, newsItems]);

    // Auto-rotate featured news
    useEffect(() => {
        const featuredNews = filteredNews.filter(item => item.featured);
        if (featuredNews.length > 1) {
            const interval = setInterval(() => {
                setCurrentNewsIndex(prev => (prev + 1) % featuredNews.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [filteredNews]);

    const featuredNews = filteredNews.filter(item => item.featured);
    const regularNews = filteredNews.filter(item => !item.featured);
    const currentFeatured = featuredNews[currentNewsIndex];

    return (
        <div className="w-full max-w-screen mx-auto bg-white dark:bg-gray-900 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] dark:from-amber-600 dark:to-amber-700 p-6 sm:px-30 text-white pt-32">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Latest Museum News</h2>
                            <p className="text-white/80 text-sm">Stay updated with discoveries and events</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Live Updates</span>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                        <input
                            type="text"
                            placeholder="Search news..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="pl-10 pr-8 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none cursor-pointer"
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value} className="text-gray-900">
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-6 sm:px-30">
                {/* Featured News Carousel */}
                {featuredNews.length > 0 && currentFeatured && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="w-5 h-5 text-[#7f1d1d] dark:text-amber-500" />
                            <h3 className="font-semibold text-[#7f1d1d] dark:text-amber-500">Featured News</h3>
                        </div>

                        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentFeatured.category)} text-gray-700 dark:text-gray-300`}>
                                            {categories.find(c => c.value === currentFeatured.category)?.label}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {getPriorityIcon(currentFeatured.priority)}
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(currentFeatured.date)}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                                        {currentFeatured.headline}
                                    </h3>

                                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                        {currentFeatured.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{currentFeatured.readTime} min read</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{currentFeatured.views.toLocaleString()} views</span>
                                            </div>
                                        </div>

                                        <button className="flex items-center gap-2 px-4 py-2 bg-[#7f1d1d] dark:bg-amber-600 text-white rounded-lg hover:bg-[#991b1b] dark:hover:bg-amber-700 transition-colors">
                                            <span>Read More</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Carousel indicators */}
                            {featuredNews.length > 1 && (
                                <div className="flex justify-center gap-2 mt-6">
                                    {featuredNews.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentNewsIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-colors ${index === currentNewsIndex
                                                    ? 'bg-[#7f1d1d] dark:bg-amber-500'
                                                    : 'bg-gray-300 dark:bg-gray-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Regular News Grid */}
                {regularNews.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">All News</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {filteredNews.length} {filteredNews.length === 1 ? 'article' : 'articles'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {regularNews.map((item) => (
                                <div
                                    key={item.id}
                                    className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg hover:border-[#7f1d1d] dark:hover:border-amber-500 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(item.category)} text-gray-700 dark:text-gray-300`}>
                                                {categories.find(c => c.value === item.category)?.label}
                                            </span>
                                            {getPriorityIcon(item.priority)}
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(item.date)}
                                        </span>
                                    </div>

                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#7f1d1d] dark:group-hover:text-amber-500 transition-colors line-clamp-2">
                                        {item.headline}
                                    </h4>

                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                        {item.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{item.readTime}m</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                <span>{item.views}</span>
                                            </div>
                                        </div>

                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#7f1d1d] dark:group-hover:text-amber-500 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No results state */}
                {filteredNews.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No news found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Try adjusting your search terms or filter selection.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LatestNewsBulletin;