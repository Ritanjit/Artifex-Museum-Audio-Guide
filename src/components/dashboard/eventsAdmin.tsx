// src/pages/admin/EventsAdminPage.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Star, Plus, Edit, Trash2, Save, X, Search, Filter, ChevronDown, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, LayoutDashboard } from 'lucide-react';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '@/actions/events';

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

const EventsAdminPage: React.FC = () => {
    // Initialize events as empty array
    const [events, setEvents] = useState<Event[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [activeTab, setActiveTab] = useState<'events' | 'calendar'>('events');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Update formData initialization
    const [formData, setFormData] = useState<Omit<Event, 'id'>>({
        title: '',
        description: '',
        date: new Date(),
        time: '',
        location: '',
        category: 'exhibition',
        featured: false
    });

    // Fetch events on component mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsData = await getAllEvents();
                // Convert date strings to Date objects
                const formattedEvents = eventsData.map((event: any) => ({
                    ...event,
                    date: new Date(event.date)
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Failed to fetch events:', error);
                showToast('Failed to load events', 'error');
            }
        };

        fetchEvents();
    }, []);


    const categories = [
        { id: 'all', name: 'All Categories', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
        { id: 'exhibition', name: 'Exhibitions', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
        { id: 'workshop', name: 'Workshops', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
        { id: 'lecture', name: 'Lectures', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
        { id: 'cultural', name: 'Cultural', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
        { id: 'special', name: 'Special', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' }
    ];

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddEvent = () => {
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            date: new Date(),
            time: '',
            location: '',
            category: 'exhibition',
            // capacity: 0,
            // price: 0,
            featured: false
        });
        setShowModal(true);
    };

    const handleEditEvent = (event: Event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            location: event.location,
            category: event.category,
            // capacity: event.capacity,
            // price: event.price,
            featured: event.featured
        });
        setShowModal(true);
    };

    // Modify handleSaveEvent to use API
    const handleSaveEvent = async () => {
        if (!formData.title || !formData.time || !formData.location) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        try {
            // Prepare data for API (convert Date to ISO string)
            const apiData = {
                ...formData,
                date: formData.date.toISOString()
            };

            if (editingEvent) {
                await updateEvent(editingEvent.id, apiData);
                setEvents(events.map(event =>
                    event.id === editingEvent.id
                        ? { ...formData, id: editingEvent.id }
                        : event
                ));
                showToast('Event updated successfully');
            } else {
                const response = await createEvent(apiData);
                const newEvent = {
                    ...formData,
                    id: response.result.id
                };
                setEvents([...events, newEvent]);
                showToast('Event created successfully');
            }

            setShowModal(false);
            setEditingEvent(null);
        } catch (error) {
            console.error('Error saving event:', error);
            showToast('Failed to save event', 'error');
        }
    };


    // Modify handleDeleteEvent to use API
    const handleDeleteEvent = async (id: string) => {
        try {
            await deleteEvent(id);
            setEvents(events.filter(event => event.id !== id));
            setShowDeleteConfirm(null);
            showToast('Event deleted successfully');
        } catch (error) {
            console.error('Error deleting event:', error);
            showToast('Failed to delete event', 'error');
        }
    };

    const getCategoryColor = (category: string) => {
        const categoryData = categories.find(cat => cat.id === category);
        return categoryData?.color || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (registered: number, capacity: number) => {
        const percentage = (registered / capacity) * 100;
        if (percentage >= 90) return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
        if (percentage >= 70) return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
    };

    // Calendar functions
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

    const getEventsForDate = (date: Date) => {
        return events.filter(event =>
            event.date.toDateString() === date.toDateString()
        );
    };

    const handleDateClick = (date: Date) => {
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
            // Clicking the same date again will clear the selection
            setSelectedDate(null);
        } else {
            // Clicking a new date will select it
            setSelectedDate(date);
        }
    };

    const generateCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg max-w-sm transition-all transform ${toast.type === 'success' ? 'bg-green-600 text-white' :
                    toast.type === 'error' ? 'bg-red-600 text-white' :
                        'bg-blue-600 text-white'
                    }`}>
                    <div className="flex items-center gap-2">
                        {toast.type === 'success' && <CheckCircle size={20} />}
                        {toast.type === 'error' && <AlertCircle size={20} />}
                        <span>{toast.message}</span>
                        <button onClick={() => setToast(null)}>
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#7f1d1d] to-[#991b1b] dark:from-amber-600 dark:to-amber-700 rounded-xl flex items-center justify-center">
                            <LayoutDashboard className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events Dashboard</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage museum events and exhibitions</p>
                        </div>
                    </div>

                    <button
                        onClick={handleAddEvent}
                        className="bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] hover:from-[#991b1b] hover:to-[#7f1d1d] dark:from-amber-600 dark:to-amber-700 dark:hover:from-amber-700 dark:hover:to-amber-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg"
                    >
                        <Plus size={20} />
                        Create Event
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`px-6 py-3 font-medium text-lg relative ${activeTab === 'events' ? 'text-[#7f1d1d] dark:text-amber-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        Events
                        {activeTab === 'events' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#7f1d1d] dark:bg-amber-500 rounded-t-full"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('calendar')}
                        className={`px-6 py-3 font-medium text-lg relative ${activeTab === 'calendar' ? 'text-[#7f1d1d] dark:text-amber-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        Calendar
                        {activeTab === 'calendar' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#7f1d1d] dark:bg-amber-500 rounded-t-full"></div>
                        )}
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategory === category.id
                                    ? 'bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] dark:from-amber-600 dark:to-amber-700 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{events.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl flex items-center justify-center">
                                <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Featured Events</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{events.filter(e => e.featured).length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl flex items-center justify-center">
                                <Star className="text-amber-600 dark:text-amber-400" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Capacity</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{events.reduce((sum, e) => sum + e.capacity, 0)}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/20 rounded-xl flex items-center justify-center">
                                <Users className="text-green-600 dark:text-green-400" size={24} />
                            </div>
                        </div>
                    </div> */}

                    {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Registered</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{events.reduce((sum, e) => sum + e.registered, 0)}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl flex items-center justify-center">
                                <Users className="text-purple-600 dark:text-purple-400" size={24} />
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Content Area */}
                {activeTab === 'events' ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-[#7f1d1d]/10 to-[#991b1b]/10 dark:from-amber-600/10 dark:to-amber-700/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Event</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Date & Time</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Location</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Category</th>
                                        {/* <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Capacity</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Price</th> */}
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredEvents.map(event => (
                                        <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-gray-900 dark:text-white">{event.title}</span>
                                                            {event.featured && (
                                                                <Star size={16} className="text-[#7f1d1d] dark:text-amber-500 fill-current" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{event.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                <div>{event.date.toLocaleDateString()}</div>
                                                <div className="text-xs">{event.time}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{event.location}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                                                    {event.category}
                                                </span>
                                            </td>
                                            {/* <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.registered, event.capacity)}`}>
                                                    {event.registered}/{event.capacity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-[#7f1d1d] dark:text-amber-500">
                                                {event.price > 0 ? `₹${event.price}` : 'FREE'}
                                            </td> */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleEditEvent(event)}
                                                        className="text-gray-400 hover:text-[#7f1d1d] dark:hover:text-amber-500 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(event.id)}
                                                        className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Calendar */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <button
                                    onClick={prevMonth}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h3>
                                <button
                                    onClick={nextMonth}
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
                                    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
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
                                            <div className={`text-sm font-medium ${isToday ? 'text-[#7f1d1d] dark:text-amber-400' : ''}`}>
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
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {(selectedDate
                                    ? getEventsForDate(selectedDate)
                                    : [...events]
                                        .sort((a, b) => a.date.getTime() - b.date.getTime())
                                        .slice(0, 5)
                                ).map(event => (
                                    <div
                                        key={event.id}
                                        className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => handleEditEvent(event)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <Clock size={14} />
                                                    <span>{event.time}</span>
                                                </div>
                                            </div>
                                            {event.featured && (
                                                <Star size={16} className="text-[#7f1d1d] dark:text-amber-500 fill-current" />
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(event.category)}`}>
                                                {event.category}
                                            </span>
                                            {/* <span className="text-sm font-medium text-[#7f1d1d] dark:text-amber-500">
                                                {event.price > 0 ? `₹${event.price}` : 'FREE'}
                                            </span> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Event Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Event Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Enter event title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Event['category'] })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent"
                                    >
                                        <option value="exhibition">Exhibition</option>
                                        <option value="workshop">Workshop</option>
                                        <option value="lecture">Lecture</option>
                                        <option value="cultural">Cultural</option>
                                        <option value="special">Special</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent"
                                    placeholder="Enter event description"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date.toISOString().split('T')[0]}
                                        onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Time *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent"
                                        placeholder="e.g., 10:00 AM - 5:00 PM"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7f1d1d] dark:focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Enter event location"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center cursor-pointer mt-8">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={formData.featured}
                                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                                className="sr-only"
                                            />
                                            <div className={`block w-14 h-8 rounded-full ${formData.featured ? 'bg-[#7f1d1d] dark:bg-amber-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.featured ? 'transform translate-x-6' : ''}`}></div>
                                        </div>
                                        <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                                            Featured Event
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEvent}
                                className="px-4 py-2 bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] hover:from-[#991b1b] hover:to-[#7f1d1d] dark:from-amber-600 dark:to-amber-700 dark:hover:from-amber-700 dark:hover:to-amber-600 text-white rounded-lg flex items-center gap-2"
                            >
                                <Save size={18} />
                                {editingEvent ? 'Update Event' : 'Create Event'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            <Trash2 className="mx-auto text-red-600 dark:text-red-500 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Event</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Are you sure you want to delete this event? This action cannot be undone.
                            </p>

                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteEvent(showDeleteConfirm)}
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsAdminPage;