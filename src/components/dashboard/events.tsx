import React, { useState } from "react";
import { X, Plus, Trash2, Calendar as CalendarIcon, Newspaper, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/buttons";
import { Calendar } from "../ui/calendar";

interface NewsHeadline {
    id: string;
    date: Date;
    headline: string;
}

interface ImportantDate {
    id: string;
    date: Date;
    eventName: string;
}

const EventsAdmin: React.FC = () => {
    // News headlines state
    const [newsHeadlines, setNewsHeadlines] = useState<NewsHeadline[]>([]);
    const [newNewsHeadline, setNewNewsHeadline] = useState<Omit<NewsHeadline, 'id'>>({
        headline: "",
        date: new Date()
    });
    const [isAddingNews, setIsAddingNews] = useState(false);

    // Important dates state
    const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
    const [newImportantDate, setNewImportantDate] = useState<Omit<ImportantDate, 'id'>>({
        eventName: "",
        date: new Date()
    });
    const [isAddingImportantDate, setIsAddingImportantDate] = useState(false);

    // Calendar state
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    
    // Toast state
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [showToast, setShowToast] = useState(false);

    // Toast notification
    const triggerToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    // Calendar navigation
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    
    // Get days for calendar
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Get events for a specific date
    const getEventsForDate = (date: Date) => {
        return importantDates.filter(event => isSameDay(event.date, date));
    };

    // Handle adding a news headline
    const handleAddNewsHeadline = () => {
        if (!newNewsHeadline.headline.trim()) {
            triggerToast("Headline is required", "error");
            return;
        }

        const news: NewsHeadline = {
            ...newNewsHeadline,
            id: Math.random().toString(36).substring(2, 9),
        };

        setNewsHeadlines([...newsHeadlines, news]);
        setNewNewsHeadline({ headline: "", date: new Date() });
        setIsAddingNews(false);
        triggerToast("News headline added successfully");
    };

    // Handle adding an important date
    const handleAddImportantDate = () => {
        if (!newImportantDate.eventName.trim()) {
            triggerToast("Event name is required", "error");
            return;
        }

        const date: ImportantDate = {
            ...newImportantDate,
            id: Math.random().toString(36).substring(2, 9),
        };

        setImportantDates([...importantDates, date]);
        setNewImportantDate({ eventName: "", date: new Date() });
        setIsAddingImportantDate(false);
        triggerToast("Important date added successfully");
    };

    // Handle removing a news headline
    const handleRemoveNews = (id: string) => {
        setNewsHeadlines(newsHeadlines.filter(news => news.id !== id));
        triggerToast("News headline removed");
    };

    // Handle removing an important date
    const handleRemoveImportantDate = (id: string) => {
        setImportantDates(importantDates.filter(date => date.id !== id));
        triggerToast("Important date removed");
    };

    // Calendar cell component
    const CalendarCell = ({ date }: { date: Date }) => {
        const isCurrentMonth = isSameMonth(date, currentMonth);
        const isToday = isSameDay(date, new Date());
        const events = getEventsForDate(date);
        
        return (
            <div 
                className={`min-h-20 p-1 border border-gray-200 dark:border-zinc-700 relative
                    ${isCurrentMonth ? "bg-white dark:bg-zinc-800" : "bg-gray-50 dark:bg-zinc-900 text-gray-400 dark:text-zinc-500"}`}
            >
                <div className="text-right">
                    <span className={`inline-block w-6 h-6 text-center text-sm rounded-full
                        ${isToday ? "bg-red-800 dark:bg-amber-600 text-white" : ""}`}>
                        {date.getDate()}
                    </span>
                </div>
                
                {events.length > 0 && (
                    <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                        {events.map((event, index) => (
                            <div 
                                key={`${date.toISOString()}-${index}`}
                                className="text-xs p-1 bg-red-50 dark:bg-amber-900/30 text-red-800 dark:text-amber-200 rounded truncate"
                            >
                                {event.eventName}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen px-6 sm:px-10 py-10 bg-gray-100 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            {/* Toast Notification */}
            {showToast && toast && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-sm shadow-lg text-sm max-w-sm 
                    ${toast.type === "success" ? "bg-red-800 dark:bg-amber-600 text-white" : "bg-red-900 text-white"}
                    animate-slide-in`}>
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

            {/* Main Content */}
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Events Management</h2>
                </div>

                <div className="grid grid-cols-1 gap-8"> {/* Changed from lg:grid-cols-2 to grid-cols-1 */}
                    {/* News Headlines Section */}
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-zinc-700">
                            <Newspaper className="text-red-800 dark:text-amber-600" size={24} />
                            <h3 className="text-xl font-semibold">News Headlines</h3>
                            <button
                                onClick={() => setIsAddingNews(true)}
                                className="ml-auto bg-red-800 hover:bg-red-900 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-4 py-1 rounded-lg flex items-center gap-2 text-sm"
                            >
                                <Plus size={16} />
                                Add News
                            </button>
                        </div>

                        {/* Add News Form */}
                        {isAddingNews && (
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-zinc-700/50 rounded-lg">
                                <h4 className="font-medium mb-3">Add News Headline</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block mb-1 text-sm">Headline *</label>
                                        <input
                                            type="text"
                                            value={newNewsHeadline.headline}
                                            onChange={(e) => setNewNewsHeadline({ ...newNewsHeadline, headline: e.target.value })}
                                            placeholder="Enter headline"
                                            className="w-full px-3 py-2 rounded-md border bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm">Date</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className="w-full justify-start text-left font-normal text-sm"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {newNewsHeadline.date ? format(newNewsHeadline.date, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={newNewsHeadline.date}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setNewNewsHeadline({ ...newNewsHeadline, date });
                                                        }
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            onClick={() => setIsAddingNews(false)}
                                            className="px-3 py-1.5 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-zinc-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddNewsHeadline}
                                            className="bg-red-800 hover:bg-red-900 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-sm"
                                        >
                                            Add News
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* News Headlines List */}
                        <div>
                            {newsHeadlines.length === 0 ? (
                                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                    No news headlines yet
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {newsHeadlines
                                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                                        .map((news) => (
                                            <div key={news.id} className="p-3 bg-gray-50 dark:bg-zinc-700/30 rounded-lg group">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="text-sm text-red-800 dark:text-amber-500 mb-1">
                                                            {format(news.date, "MMMM d, yyyy")}
                                                        </div>
                                                        <h4 className="font-medium">{news.headline}</h4>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveNews(news.id)}
                                                        className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Important Dates Section */}
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-zinc-700">
                            <Bell className="text-red-800 dark:text-amber-600" size={24} />
                            <h3 className="text-xl font-semibold">Important Dates & Calendar</h3>
                            <button
                                onClick={() => setIsAddingImportantDate(true)}
                                className="ml-auto bg-red-800 hover:bg-red-900 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-4 py-1 rounded-lg flex items-center gap-2 text-sm"
                            >
                                <Plus size={16} />
                                Add Date
                            </button>
                        </div>

                        {/* Add Important Date Form */}
                        {isAddingImportantDate && (
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-zinc-700/50 rounded-lg">
                                <h4 className="font-medium mb-3">Add Important Date</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block mb-1 text-sm">Event Name *</label>
                                        <input
                                            type="text"
                                            value={newImportantDate.eventName}
                                            onChange={(e) => setNewImportantDate({ ...newImportantDate, eventName: e.target.value })}
                                            placeholder="Enter event name"
                                            className="w-full px-3 py-2 rounded-md border bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm">Date</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className="w-full justify-start text-left font-normal text-sm"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {newImportantDate.date ? format(newImportantDate.date, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={newImportantDate.date}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setNewImportantDate({ ...newImportantDate, date });
                                                        }
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            onClick={() => setIsAddingImportantDate(false)}
                                            className="px-3 py-1.5 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-zinc-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddImportantDate}
                                            className="bg-red-800 hover:bg-red-900 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-sm"
                                        >
                                            Add Date
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Important Dates List */}
                            <div>
                                <h4 className="font-medium mb-3">Scheduled Dates</h4>
                                {importantDates.length === 0 ? (
                                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                        No important dates scheduled
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                        {importantDates
                                            .sort((a, b) => a.date.getTime() - b.date.getTime())
                                            .map((date) => (
                                                <div key={date.id} className="p-3 bg-gray-50 dark:bg-zinc-700/30 rounded-lg group">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="text-sm text-red-800 dark:text-amber-500 mb-1">
                                                                {format(date.date, "MMMM d, yyyy")}
                                                            </div>
                                                            <h4 className="font-medium">{date.eventName}</h4>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveImportantDate(date.id)}
                                                            className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>

                            {/* Calendar Preview */}
                            <div>
                                <h4 className="font-medium mb-3">Calendar Preview</h4>
                                <div className="bg-white dark:bg-zinc-700/30 border border-gray-200 dark:border-zinc-700 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-600">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <h4 className="font-medium">
                                            {format(currentMonth, "MMMM yyyy")}
                                        </h4>
                                        <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-600">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                                            <div key={i} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="grid grid-cols-7 gap-1">
                                        {daysInMonth.map((date, i) => (
                                            <CalendarCell key={i} date={date} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventsAdmin;