// src/components/bulletin/homeNews.tsx
import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    ChevronRight,
    ArrowRight,
    ExternalLink,
    BookOpen,
    Sparkles,
    Play,
    Pause
} from 'lucide-react';
import { getAllNews } from '@/actions/news';
import { getAllEvents } from '@/actions/events';

interface NewsItem {
    id: string;
    headline: string;
    date: string | Date;
    category: 'discovery' | 'exhibition' | 'workshop' | 'cultural' | 'research';
    excerpt: string;
    featured: boolean;
    updated_at: string | Date;
    tags?: string[]; // Add tags if needed
}

interface Event {
    id: string;
    title: string;
    description: string;
    date: string | Date;
    time: string;
    location: string;
    category: 'exhibition' | 'workshop' | 'lecture' | 'cultural' | 'special';
    featured: boolean;
}

const HomeNewsEventsHighlights: React.FC = () => {
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [isNewsPlaying, setIsNewsPlaying] = useState(true);
    const [isEventsPlaying, setIsEventsPlaying] = useState(true);
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch news and events from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newsData, eventsData] = await Promise.all([
                    getAllNews(),
                    getAllEvents()
                ]);

                // Process news data - remove the featured filter
                const formattedNews = (newsData || []).map((item: any) => ({
                    ...item,
                    date: item.date ? new Date(item.date) : new Date(),
                    updated_at: item.updated_at ? new Date(item.updated_at) : new Date()
                }));

                // Process events data - keep featured filter for events
                const formattedEvents = (eventsData || []).map((item: any) => ({
                    ...item,
                    date: item.date ? new Date(item.date) : new Date()
                })).filter((item: any) => item.featured);

                setNewsItems(formattedNews);
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

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

    const formatDate = (dateInput: string | Date | undefined) => {
        if (!dateInput) return '';
        const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

        if (isNaN(date.getTime())) return '';

        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

    if (isLoading) {
        return (
            <div className="w-full bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100 dark:from-gray-900 dark:via-black dark:to-gray-900 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f1d1d] dark:border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading highlights...</p>
                </div>
            </div>
        );
    }

    if (!newsItems.length && !events.length) {
        return (
            <div className="w-full bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100 dark:from-gray-900 dark:via-black dark:to-gray-900 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="p-2 bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] dark:from-amber-600 dark:to-amber-700 rounded-lg w-12 h-12 mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-white mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        No highlights available
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Check back later for the latest news and events
                    </p>
                </div>
            </div>
        );
    }

    const currentNews = newsItems[currentNewsIndex] || null;
    const currentEvent = events[currentEventIndex] || null;

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
                    {newsItems.length > 0 && (
                        <div className="relative h-[400px]">
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-[#7f1d1d]/20 dark:border-amber-500/20 overflow-hidden shadow-xl h-full flex flex-col">
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
                                <div className="p-6 flex-grow overflow-y-auto">
                                    {currentNews && (
                                        <>
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-3 min-h-0 overflow-y-auto">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentNews.category)}`}>
                                                        {currentNews.category}
                                                    </span>
                                                    {currentNews.featured && (
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                                            Featured
                                                        </span>
                                                    )}
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
                                                            <span>Updated {formatDate(currentNews.updated_at)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* News Navigation Dots */}
                                            <div className="flex justify-center gap-2 mt-4">
                                                {newsItems.map((_, index) => (
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
                                        </>
                                    )}
                                </div>

                                {/* View All News Button */}
                                <div className="px-6 pb-6">
                                    <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-[#7f1d1d] dark:border-amber-500 text-[#7f1d1d] dark:text-amber-500 rounded-lg hover:bg-[#7f1d1d] hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-colors">
                                        View All News
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Featured Events Section */}
                    {events.length > 0 && (
                        <div className="relative h-[400px]">
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-[#7f1d1d]/20 dark:border-amber-500/20 overflow-hidden shadow-xl h-full flex flex-col">
                                {/* Events Header */}
                                <div className="bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] dark:from-amber-600 dark:to-amber-700 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-white" />
                                            <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
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
                                <div className="p-6 flex-grow overflow-y-auto">
                                    {currentEvent && (
                                        <>
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentEvent.category)}`}>
                                                        {currentEvent.category}
                                                    </span>
                                                </div>

                                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                                                    {currentEvent.title}
                                                </h4>

                                                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                                    {currentEvent.description}
                                                </p>

                                                <div className="mb-4 flex items-center gap-5">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                        <Calendar className="w-4 h-4 text-[#7f1d1d] dark:text-amber-500" />
                                                        <span>
                                                            {currentEvent.date instanceof Date
                                                                ? currentEvent.date.toLocaleDateString('en-US', {
                                                                    weekday: 'long',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })
                                                                : formatDate(currentEvent.date)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                        <Clock className="w-4 h-4 text-[#7f1d1d] dark:text-amber-500" />
                                                        <span>{currentEvent.time}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Event Navigation Dots */}
                                            <div className="flex justify-center gap-2 mt-4">
                                                {events.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentEventIndex(index)}
                                                        className={`w-2 h-2 rounded-full transition-colors ${index === currentEventIndex
                                                            ? 'bg-[#7f1d1d] dark:bg-amber-500'
                                                            : 'bg-gray-300 dark:bg-gray-600'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Register & View All Events Buttons */}
                                <div className="px-6 pb-6 space-y-3">
                                    <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-[#7f1d1d] dark:border-amber-500 text-[#7f1d1d] dark:text-amber-500 rounded-lg hover:bg-[#7f1d1d] hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-colors">
                                        View All Events
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomeNewsEventsHighlights;