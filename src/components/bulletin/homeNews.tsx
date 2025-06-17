import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Star,
    TrendingUp,
    ChevronRight,
    ArrowRight,
    Eye,
    Timer,
    BookOpen,
    Sparkles,
    Play,
    Pause,
    ExternalLink,
    Heart
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

interface Event {
    id: string;
    title: string;
    description: string;
    date: Date;
    time: string;
    location: string;
    category: 'exhibition' | 'workshop' | 'lecture' | 'cultural' | 'special';
    capacity: number;
    registered: number;
    price: number;
    featured: boolean;
}

const HomeNewsEventsHighlights: React.FC = () => {
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [isNewsPlaying, setIsNewsPlaying] = useState(true);
    const [isEventsPlaying, setIsEventsPlaying] = useState(true);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Sample news data
    const newsItems: NewsItem[] = [
        {
            id: '1',
            headline: 'Rare 15th Century Ahom Manuscript Discovered in Majuli',
            date: new Date('2025-06-15'),
            category: 'discovery',
            priority: 'high',
            readTime: 5,
            views: 1247,
            excerpt: 'Archaeologists have uncovered a pristine manuscript containing ancient Tai Ahom scripts and royal genealogies...',
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
            excerpt: 'Experience centuries of Ahom history through our new immersive digital platform with 3D reconstructions...',
            featured: true
        },
        {
            id: '3',
            headline: 'Royal Seal Collection: New Acquisitions from Private Donors',
            date: new Date('2025-06-08'),
            category: 'cultural',
            priority: 'medium',
            readTime: 4,
            views: 634,
            excerpt: 'Three rare royal seals from the Ahom dynasty have been generously donated to expand our collection...',
            featured: true
        }
    ];

    // Sample events data
    const events: Event[] = [
        {
            id: '1',
            title: 'Ancient Ahom Manuscripts Exhibition',
            description: 'Explore rare 600-year-old manuscripts showcasing the rich heritage of the Ahom dynasty.',
            date: new Date(2025, 6, 15),
            time: '10:00 AM - 6:00 PM',
            location: 'Main Gallery',
            category: 'exhibition',
            capacity: 200,
            registered: 156,
            price: 0,
            featured: true
        },
        {
            id: '2',
            title: 'Tai Ahom Script Workshop',
            description: 'Learn the ancient art of writing in Tai Ahom script with expert guidance.',
            date: new Date(2025, 6, 18),
            time: '2:00 PM - 5:00 PM',
            location: 'Workshop Hall',
            category: 'workshop',
            capacity: 30,
            registered: 24,
            price: 500,
            featured: true
        },
        {
            id: '3',
            title: 'Traditional Assamese Cultural Night',
            description: 'Experience traditional music, dance, and storytelling from Assam.',
            date: new Date(2025, 6, 25),
            time: '7:00 PM - 9:30 PM',
            location: 'Courtyard',
            category: 'cultural',
            capacity: 300,
            registered: 267,
            price: 300,
            featured: true
        }
    ];

    // Auto-rotate news
    useEffect(() => {
        if (isNewsPlaying && newsItems.length > 1) {
            const interval = setInterval(() => {
                setCurrentNewsIndex(prev => (prev + 1) % newsItems.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [isNewsPlaying, newsItems.length]);

    // Auto-rotate events
    useEffect(() => {
        if (isEventsPlaying && events.length > 1) {
            const interval = setInterval(() => {
                setCurrentEventIndex(prev => (prev + 1) % events.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isEventsPlaying, events.length]);

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 dark:text-red-400';
            case 'medium': return 'text-amber-600 dark:text-amber-400';
            default: return 'text-gray-600 dark:text-gray-400';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'discovery': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
            case 'exhibition': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'workshop': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            case 'cultural': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
            case 'research': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300';
            case 'lecture': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
            case 'special': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const toggleFavorite = (id: string) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(id)) {
            newFavorites.delete(id);
        } else {
            newFavorites.add(id);
        }
        setFavorites(newFavorites);
    };

    const currentNews = newsItems[currentNewsIndex];
    const currentEvent = events[currentEventIndex];

    return (
        <div className="w-full bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100 dark:from-gray-900 dark:via-black dark:to-gray-900 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] dark:from-amber-600 dark:to-amber-700 rounded-lg">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Latest Highlights
                        </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Stay updated with the latest discoveries, exhibitions, and cultural events from our museum
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Featured News Section */}
                    <div className="relative">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-[#7f1d1d]/20 dark:border-amber-500/20 overflow-hidden shadow-xl">
                            {/* News Header */}
                            <div className="bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] dark:from-amber-600 dark:to-amber-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="w-5 h-5 text-white" />
                                        <h3 className="text-lg font-semibold text-white">Breaking News</h3>
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-white/80">Live</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setIsNewsPlaying(!isNewsPlaying)}
                                            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                        >
                                            {isNewsPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                                        </button>
                                        <span className="text-xs text-white/80">
                                            {currentNewsIndex + 1}/{newsItems.length}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* News Content */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentNews.category)}`}>
                                            {currentNews.category}
                                        </span>
                                        <TrendingUp className={`w-4 h-4 ${getPriorityColor(currentNews.priority)}`} />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(currentNews.date)}
                                        </span>
                                    </div>

                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                                        {currentNews.headline}
                                    </h4>

                                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                        {currentNews.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{currentNews.readTime} min</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{currentNews.views}</span>
                                            </div>
                                        </div>

                                        <button className="flex items-center gap-2 px-4 py-2 bg-[#7f1d1d] dark:bg-amber-600 text-white rounded-lg hover:bg-[#991b1b] dark:hover:bg-amber-700 transition-colors text-sm">
                                            Read More
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* News Navigation Dots */}
                                <div className="flex justify-center gap-2 mt-4">
                                    {newsItems.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentNewsIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-colors ${
                                                index === currentNewsIndex
                                                    ? 'bg-[#7f1d1d] dark:bg-amber-500'
                                                    : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* View All News Button */}
                            <div className="px-6 pb-6">
                                <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-[#7f1d1d] dark:border-amber-500 text-[#7f1d1d] dark:text-amber-500 rounded-lg hover:bg-[#7f1d1d] hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-colors">
                                    View All News
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Featured Events Section */}
                    <div className="relative">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-[#7f1d1d]/20 dark:border-amber-500/20 overflow-hidden shadow-xl">
                            {/* Events Header */}
                            <div className="bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] dark:from-amber-600 dark:to-amber-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-white" />
                                        <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
                                        <Star className="w-4 h-4 text-yellow-300 fill-current" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setIsEventsPlaying(!isEventsPlaying)}
                                            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                        >
                                            {isEventsPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                                        </button>
                                        <span className="text-xs text-white/80">
                                            {currentEventIndex + 1}/{events.length}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Event Content */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentEvent.category)}`}>
                                            {currentEvent.category}
                                        </span>
                                        <button
                                            onClick={() => toggleFavorite(currentEvent.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Heart className={`w-5 h-5 ${favorites.has(currentEvent.id) ? 'fill-red-500 text-red-500' : ''}`} />
                                        </button>
                                    </div>

                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                                        {currentEvent.title}
                                    </h4>

                                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                        {currentEvent.description}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <Calendar className="w-4 h-4 text-[#7f1d1d] dark:text-amber-500" />
                                            <span>{currentEvent.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <Clock className="w-4 h-4 text-[#7f1d1d] dark:text-amber-500" />
                                            <span>{currentEvent.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <MapPin className="w-4 h-4 text-[#7f1d1d] dark:text-amber-500" />
                                            <span>{currentEvent.location}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-sm">
                                                <Users className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    {currentEvent.registered}/{currentEvent.capacity}
                                                </span>
                                            </div>
                                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                                                <div
                                                    className="bg-[#7f1d1d] dark:bg-amber-500 h-1 rounded-full"
                                                    style={{ width: `${(currentEvent.registered / currentEvent.capacity) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <span className="text-lg font-bold text-[#7f1d1d] dark:text-amber-400">
                                            {currentEvent.price > 0 ? `₹${currentEvent.price}` : 'FREE'}
                                        </span>
                                    </div>
                                </div>

                                {/* Event Navigation Dots */}
                                <div className="flex justify-center gap-2 mt-4">
                                    {events.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentEventIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-colors ${
                                                index === currentEventIndex
                                                    ? 'bg-[#7f1d1d] dark:bg-amber-500'
                                                    : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Register & View All Events Buttons */}
                            <div className="px-6 pb-6 space-y-3">
                                <button className="w-full py-3 bg-[#7f1d1d] dark:bg-amber-600 text-white rounded-lg hover:bg-[#991b1b] dark:hover:bg-amber-700 transition-colors font-medium">
                                    Register Now
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-[#7f1d1d] dark:border-amber-500 text-[#7f1d1d] dark:text-amber-500 rounded-lg hover:bg-[#7f1d1d] hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-colors">
                                    View All Events
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* // Quick Stats
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 text-center">
                        <div className="text-2xl font-bold text-[#7f1d1d] dark:text-amber-500 mb-1">
                            {newsItems.filter(n => n.priority === 'high').length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Breaking News</div>
                    </div>
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 text-center">
                        <div className="text-2xl font-bold text-[#7f1d1d] dark:text-amber-500 mb-1">
                            {events.filter(e => e.featured).length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Featured Events</div>
                    </div>
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 text-center">
                        <div className="text-2xl font-bold text-[#7f1d1d] dark:text-amber-500 mb-1">
                            {events.reduce((sum, e) => sum + e.registered, 0)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Registrations</div>
                    </div>
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 text-center">
                        <div className="text-2xl font-bold text-[#7f1d1d] dark:text-amber-500 mb-1">
                            {newsItems.reduce((sum, n) => sum + n.views, 0)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Total Views</div>
                    </div>
                </div> */}
                
            </div>
        </div>
    );
};

export default HomeNewsEventsHighlights;