import React, { useState, useEffect } from 'react';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Clock,
    Users,
    Star,
    Filter,
    Search,
    Grid,
    List,
    Eye,
    Share2,
    Heart,
    X
} from 'lucide-react';

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
    image?: string;
}

interface EventsCalendarProps {
    events?: Event[];
}

const EventsCalendar: React.FC<EventsCalendarProps> = ({ events: propEvents }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Sample events data
    const defaultEvents: Event[] = [
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
            featured: false
        },
        {
            id: '3',
            title: 'Royal Chronicles: Ahom Kings Lecture',
            description: 'Distinguished historian Dr. Sarah Johnson discusses the legacy of Ahom rulers.',
            date: new Date(2025, 6, 22),
            time: '4:00 PM - 6:00 PM',
            location: 'Auditorium',
            category: 'lecture',
            capacity: 150,
            registered: 89,
            price: 200,
            featured: true
        },
        {
            id: '4',
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
        },
        {
            id: '5',
            title: 'Manuscript Preservation Techniques',
            description: 'Learn about modern techniques used to preserve ancient manuscripts.',
            date: new Date(2025, 6, 28),
            time: '11:00 AM - 1:00 PM',
            location: 'Conservation Lab',
            category: 'workshop',
            capacity: 15,
            registered: 12,
            price: 750,
            featured: false
        }
    ];

    const events = propEvents || defaultEvents;

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

    const toggleFavorite = (eventId: string) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(eventId)) {
            newFavorites.delete(eventId);
        } else {
            newFavorites.add(eventId);
        }
        setFavorites(newFavorites);
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

                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
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
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${viewMode === 'list'
                                    ? 'bg-[#7f1d1d] text-white dark:bg-amber-600'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-[#7f1d1d] dark:hover:text-amber-400'
                                }`}
                        >
                            <List size={16} />
                            List
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8 sm:px-30">
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
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 sm:px-30 mb-5">
                    {/* Calendar */}
                    <div className="xl:col-span-2">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                            {/* Calendar Header */}
                            <div className="flex justify-between items-center mb-6">
                                <button
                                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h3>
                                <button
                                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
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
                                            onClick={() => setSelectedDate(date)}
                                            className={`relative p-2 h-16 border rounded-lg cursor-pointer transition-all hover:shadow-md ${isCurrentMonth ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
                                                } ${isSelected ? 'ring-2 ring-[#7f1d1d] dark:ring-amber-500' : ''} ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
                                                }`}
                                        >
                                            <div className={`text-sm font-medium ${isToday ? 'text-[#7f1d1d] dark:text-amber-400' : ''}`}>
                                                {date.getDate()}
                                            </div>
                                            {dayEvents.length > 0 && (
                                                <div className="absolute bottom-1 left-1 right-1">
                                                    <div className="flex flex-wrap gap-1">
                                                        {dayEvents.slice(0, 2).map((event, i) => (
                                                            <div
                                                                key={i}
                                                                className={`w-2 h-2 rounded-full ${event.featured ? 'bg-[#7f1d1d] dark:bg-amber-500' : 'bg-gray-400'
                                                                    }`}
                                                            />
                                                        ))}
                                                        {dayEvents.length > 2 && (
                                                            <div className="text-xs text-gray-500">+{dayEvents.length - 2}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Events Sidebar */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {selectedDate ? `Events on ${selectedDate.toLocaleDateString()}` : 'Upcoming Events'}
                        </h3>

                        <div className="space-y-3 max-h-125 pr-5 overflow-y-auto">
                            {(selectedDate ? getEventsForDate(selectedDate) : filteredEvents.slice(0, 5)).map(event => (
                                <div
                                    key={event.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{event.title}</h4>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(event.id);
                                            }}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Heart size={16} className={favorites.has(event.id) ? 'fill-red-500 text-red-500' : ''} />
                                        </button>
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
                                    <div className="flex justify-between items-center mt-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(event.category)}`}>
                                            {event.category}
                                        </span>
                                        {event.featured && (
                                            <Star size={12} className="text-[#7f1d1d] dark:text-amber-500 fill-current" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* List View */
                <div className="space-y-4 sm:px-30 mb-10">
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
                                        <div className="flex items-center gap-2">
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
                                        </div>
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
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className={getAvailabilityColor(event.registered, event.capacity)} />
                                            <span className={`${getAvailabilityColor(event.registered, event.capacity)} font-medium`}>
                                                {event.registered}/{event.capacity}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between items-end">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                                        {event.category}
                                    </span>
                                    <div className="text-right mt-4">
                                        {event.price > 0 ? (
                                            <span className="text-2xl font-bold text-[#7f1d1d] dark:text-amber-400">
                                                ₹{event.price}
                                            </span>
                                        ) : (
                                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                FREE
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {selectedEvent.title}
                                    </h2>
                                    {selectedEvent.featured && (
                                        <Star size={24} className="text-[#7f1d1d] dark:text-amber-500 fill-current" />
                                    )}
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
                                    <div className="flex items-center gap-3">
                                        <MapPin size={20} className="text-[#7f1d1d] dark:text-amber-500" />
                                        <span className="text-gray-900 dark:text-white">{selectedEvent.location}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Users size={20} className="text-[#7f1d1d] dark:text-amber-500" />
                                        <div>
                                            <span className="text-gray-900 dark:text-white">
                                                {selectedEvent.registered}/{selectedEvent.capacity} registered
                                            </span>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                                <div
                                                    className="bg-[#7f1d1d] dark:bg-amber-500 h-2 rounded-full"
                                                    style={{ width: `${(selectedEvent.registered / selectedEvent.capacity) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedEvent.category)}`}>
                                            {selectedEvent.category}
                                        </span>
                                        <span className="text-2xl font-bold text-[#7f1d1d] dark:text-amber-400">
                                            {selectedEvent.price > 0 ? `₹${selectedEvent.price}` : 'FREE'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 bg-[#7f1d1d] hover:bg-[#991b1b] dark:bg-amber-600 dark:hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                                    Register Now
                                </button>
                                <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <Share2 size={20} />
                                </button>
                                <button
                                    onClick={() => toggleFavorite(selectedEvent.id)}
                                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <Heart size={20} className={favorites.has(selectedEvent.id) ? 'fill-red-500 text-red-500' : ''} />
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