// src\components\bulletin\CalenderEvents.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock, Filter, Search, Grid, List, Eye, Share2, X, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { WaypointsIcon, WaypointsIconHandle } from '@/components/ui/share';
import { getAllEvents } from '@/actions/events';

interface Event {
    id: string;
    title: string;
    description: string;
    date: Date;
    time: string;
    location: string;
    category: 'exhibition' | 'workshop' | 'lecture' | 'cultural' | 'special';
    featured: boolean;
}

const EventsCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const waypointRef = useRef<WaypointsIconHandle>(null);

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Add this function to handle sharing
    const handleShare = async () => {
        try {
            const url = window.location.href;

            // Check if Web Share API is available (mobile devices)
            if (navigator.share) {
                await navigator.share({
                    title: selectedEvent?.title || 'Museum Event',
                    text: selectedEvent?.description || 'Check out this museum event',
                    url: url,
                });
            } else {
                // Fallback for desktop browsers
                await navigator.clipboard.writeText(url);
                setToast({ message: 'Event link copied to clipboard!', type: 'success' });
            }
        } catch (error) {
            console.error('Error sharing:', error);
            setToast({ message: 'Failed to share event', type: 'error' });
        }
    };

    // Initialize viewMode state with a function to check screen size
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>(() => {
        // Check if window is defined (for SSR compatibility)
        if (typeof window !== 'undefined') {
            // Check if screen is mobile (less than 1024px)
            return window.matchMedia('(max-width: 1023px)').matches ? 'list' : 'calendar';
        }
        // Default to 'calendar' if window is not available (SSR)
        return 'calendar';
    });

    // Add effect to handle screen size changes
    useEffect(() => {
        const handleResize = () => {
            if (window.matchMedia('(max-width: 1023px)').matches) {
                setViewMode('list');
            } else {
                setViewMode('calendar');
            }
        };

        // Set up event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [events, setEvents] = useState<Event[]>([]);

    // Fetch events on component mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsData = await getAllEvents();
                const formattedEvents = eventsData.map((event: any) => ({
                    ...event,
                    date: new Date(event.date)
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        };

        fetchEvents();
    }, []);

    // const events = propEvents || defaultEvents;

    const categories = [
        { id: 'all', name: 'All Events', color: 'bg-gray-100 text-gray-800' },
        { id: 'exhibition', name: 'Exhibitions', color: 'bg-blue-100 text-blue-800' },
        { id: 'workshop', name: 'Workshops', color: 'bg-green-100 text-green-800' },
        { id: 'lecture', name: 'Lectures', color: 'bg-purple-100 text-purple-800' },
        { id: 'cultural', name: 'Cultural', color: 'bg-orange-100 text-orange-800' },
        { id: 'special', name: 'Special', color: 'bg-pink-100 text-pink-800' }
    ];

    // Filter events
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Get events for a specific date
    const getEventsForDate = (date: Date) => {
        return filteredEvents.filter(event =>
            event.date.toDateString() === date.toDateString()
        );
    };

    // Calendar generation
    const generateCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(firstDay.getDate() - firstDay.getDay());

        const calendar = [];
        let currentWeek = [];

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            currentWeek.push(date);

            if (currentWeek.length === 7) {
                calendar.push(currentWeek);
                currentWeek = [];
            }
        }

        return calendar;
    };

    const calendar = generateCalendar();

    const handleDateClick = (date: Date) => {
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
            // Clicking the same date again will clear the selection
            setSelectedDate(null);
        } else {
            // Clicking a new date will select it
            setSelectedDate(date);
        }
    };

    const getCategoryColor = (category: string) => {
        const categoryData = categories.find(cat => cat.id === category);
        return categoryData?.color || 'bg-gray-100 text-gray-800';
    };

    const getAvailabilityColor = (registered: number, capacity: number) => {
        const percentage = (registered / capacity) * 100;
        if (percentage >= 90) return 'text-red-600';
        if (percentage >= 70) return 'text-amber-600';
        return 'text-green-600';
    };

    return (
        <div className="w-full max-w-8xl mx-auto bg-white dark:bg-gray-900 overflow-hidden">

            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg max-w-sm transition-all transform ${toast.type === 'success'
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                    }`}>
                    <div className="flex items-center gap-2">
                        {toast.type === 'success' ? (
                            <CheckCircle size={20} />
                        ) : (
                            <AlertCircle size={20} />
                        )}
                        <span>{toast.message}</span>
                        <button onClick={() => setToast(null)}>
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 sm:px-30 pt-32
    bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] dark:from-amber-600 dark:to-amber-700 p-6">
                <div>
                    <h2 className="text-3xl font-bold text-white dark:text-amber-400 mb-2">
                        Museum Events & Calendar
                    </h2>
                    <p className="text-white dark:text-gray-300">
                        Discover upcoming exhibitions, workshops, and cultural events
                    </p>
                </div>

                <div className="flex items-center gap-3 order-first lg:order-none">
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        {/* Show List button first on mobile */}
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${viewMode === 'list'
                                ? 'bg-[#7f1d1d] text-white dark:bg-amber-600'
                                : 'text-gray-600 dark:text-gray-300 hover:text-[#7f1d1d] dark:hover:text-amber-400'
                                } lg:hidden`}
                        >
                            <List size={16} />
                            List
                        </button>

                        {/* Calendar button - shown on all screens */}
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${viewMode === 'calendar'
                                ? 'bg-[#7f1d1d] text-white dark:bg-amber-600'
                                : 'text-gray-600 dark:text-gray-300 hover:text-[#7f1d1d] dark:hover:text-amber-400'
                                }`}
                        >
                            <Grid size={16} />
                            Calendar
                        </button>

                        {/* List button - hidden on mobile, shown on larger screens */}
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${viewMode === 'list'
                                ? 'bg-[#7f1d1d] text-white dark:bg-amber-600'
                                : 'text-gray-600 dark:text-gray-300 hover:text-[#7f1d1d] dark:hover:text-amber-400'
                                } hidden lg:flex`}
                        >
                            <List size={16} />
                            List
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8 sm:px-30 px-5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent"
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.id
                                ? 'bg-[#7f1d1d] text-white dark:bg-amber-600'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {viewMode === 'calendar' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-5 sm:px-30 mb-10">
                    {/* Calendar */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {calendar.flat().map((date, index) => {
                                const dayEvents = getEventsForDate(date);
                                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                                const isToday = date.toDateString() === new Date().toDateString();
                                const isSelected = selectedDate?.toDateString() === date.toDateString();

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleDateClick(date)}
                                        className={`relative min-h-24 p-2 border rounded-xl cursor-pointer transition-all hover:shadow-md ${isCurrentMonth ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
                                            } ${isSelected ? 'ring-2 ring-[#7f1d1d] dark:ring-amber-500' : ''
                                            } ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
                                            }`}
                                    >
                                        <div className={`text-sm font-medium ${isToday ? 'text-[#7f1d1d] dark:text-amber-400' : ''
                                            }`}>
                                            {date.getDate()}
                                        </div>
                                        {dayEvents.length > 0 && (
                                            <div className="mt-1 space-y-1">
                                                {dayEvents.slice(0, 2).map((event, i) => (
                                                    <div
                                                        key={i}
                                                        className={`text-xs p-1 rounded-lg truncate ${event.featured
                                                            ? 'bg-[#7f1d1d]/10 dark:bg-amber-600/20 text-[#7f1d1d] dark:text-amber-300'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                            }`}
                                                    >
                                                        {event.title}
                                                    </div>
                                                ))}
                                                {dayEvents.length > 2 && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        +{dayEvents.length - 2} more
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {selectedDate
                                    ? `Events on ${selectedDate.toLocaleDateString()}`
                                    : 'Upcoming Events (Next 5)'}
                            </h3>
                            {selectedDate && (
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1"
                                >
                                    <X size={14} />
                                    Show All
                                </button>
                            )}
                        </div>

                        <div className="space-y-3 overflow-y-auto pr-2">
                            {(selectedDate
                                ? getEventsForDate(selectedDate)
                                : [...events]
                                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                                    .slice(0, 5)
                            ).map(event => (
                                <div
                                    key={event.id}
                                    className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin size={12} />
                                            {event.location}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(event.category)}`}>
                                            {event.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* List View */
                <div className="space-y-4 sm:px-30 mb-10 px-5">
                    {filteredEvents.map(event => (
                        <div
                            key={event.id}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
                            onClick={() => setSelectedEvent(event)}
                        >
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                                                {event.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                {event.description}
                                            </p>
                                        </div>
                                        {/* <div className="flex items-center gap-2">
                                            {event.featured && (
                                                <Star size={20} className="text-[#7f1d1d] dark:text-amber-500 fill-current" />
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(event.id);
                                                }}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Heart size={20} className={favorites.has(event.id) ? 'fill-red-500 text-red-500' : ''} />
                                            </button>
                                        </div> */}
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                            <Calendar size={16} />
                                            {event.date.toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                            <Clock size={16} />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                            <MapPin size={16} />
                                            {event.location}
                                        </div>
                                        {/* <div className="flex items-center gap-2">
                                            <Users size={16} className={getAvailabilityColor(event.registered, event.capacity)} />
                                            <span className={`${getAvailabilityColor(event.registered, event.capacity)} font-medium`}>
                                                {event.registered}/{event.capacity}
                                            </span>
                                        </div> */}
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between items-end">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                                        {event.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-60 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {selectedEvent.title}
                                    </h2>
                                    {/* {selectedEvent.featured && (
                                        <Star size={24} className="text-[#7f1d1d] dark:text-amber-500 fill-current" />
                                    )} */}
                                </div>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                {selectedEvent.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={20} className="text-[#7f1d1d] dark:text-amber-500" />
                                        <span className="text-gray-900 dark:text-white">
                                            {selectedEvent.date.toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock size={20} className="text-[#7f1d1d] dark:text-amber-500" />
                                        <span className="text-gray-900 dark:text-white">{selectedEvent.time}</span>
                                    </div>

                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedEvent.category)}`}>
                                            {selectedEvent.category}
                                        </span>
                                        {/* <span className="text-2xl font-bold text-[#7f1d1d] dark:text-amber-400">
                                            {selectedEvent.price > 0 ? `₹${selectedEvent.price}` : 'FREE'}
                                        </span> */}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin size={20} className="text-[#7f1d1d] dark:text-amber-500" />
                                        <span className="text-gray-900 dark:text-white">{selectedEvent.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 items-center">
                                <button
                                    className="flex flex-1 items-center justify-center gap-2 bg-[#7f1d1d] hover:bg-[#991b1b] dark:bg-amber-600 dark:hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-medium transition-colors group"
                                    onClick={handleShare}
                                    onMouseEnter={() => waypointRef.current?.startAnimation()}
                                    onMouseLeave={() => waypointRef.current?.stopAnimation()}
                                >
                                    <WaypointsIcon ref={waypointRef} className="w-1 h-1 mr-6 mb-6 group-hover:scale-110 transition-transform" />
                                    <span className='text-lg'>Share Event</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsCalendar;