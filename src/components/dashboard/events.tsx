import React, { useState } from "react";
import { X, Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"; // You'll need to create these
import { Button } from "../ui/buttons"; // Basic button component
import { Calendar } from "../ui/calendar"; // You'll need to create this

interface Event {
    id: string;
    title: string;
    date: Date;
    description: string;
}

const EventsAdmin: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
        title: "",
        date: new Date(),
        description: ""
    });
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [showToast, setShowToast] = useState(false);

    // Toast notification
    const triggerToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    // Handle adding a new event
    const handleAddEvent = () => {
        if (!newEvent.title.trim()) {
            triggerToast("Event title is required", "error");
            return;
        }

        const event: Event = {
            ...newEvent,
            id: Math.random().toString(36).substring(2, 9),
        };

        setEvents([...events, event]);
        setNewEvent({ title: "", date: new Date(), description: "" });
        setIsAddingEvent(false);
        triggerToast("Event added successfully");
    };

    // Handle removing an event
    const handleRemoveEvent = (id: string) => {
        setEvents(events.filter(event => event.id !== id));
        triggerToast("Event removed");
    };

    return (
        <div className="w-full h-full overflow-y-auto px-6 sm:px-10 py-10 bg-gray-100 dark:bg-zinc-900 text-zinc-900 dark:text-white">
            {/* Toast Notification */}
            {showToast && toast && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-sm shadow-lg text-sm max-w-sm ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    } animate-slide-in`}>
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
            <div className="max-w-6xl mx-auto bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Events Management</h2>
                    <button
                        onClick={() => setIsAddingEvent(true)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add Event
                    </button>
                </div>

                {/* Add Event Form */}
                {isAddingEvent && (
                    <div className="mb-8 p-6 bg-gray-50 dark:bg-zinc-700 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Add New Event</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2 font-medium">Event Title</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    placeholder="Enter event title"
                                    className="w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 dark:border-zinc-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {newEvent.date ? format(newEvent.date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={newEvent.date}
                                            onSelect={(date) => {
                                                if (date) {
                                                    setNewEvent({ ...newEvent, date });
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">Description (Optional)</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    placeholder="Enter event description"
                                    className="w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 dark:border-zinc-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setIsAddingEvent(false)}
                                    className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddEvent}
                                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Add Event
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Events List */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Upcoming Events</h3>

                    {events.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            No events scheduled yet
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-zinc-600">
                            {events
                                .sort((a, b) => a.date.getTime() - b.date.getTime())
                                .map((event) => (
                                    <div key={event.id} className="py-4 group">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-lg font-medium">{event.title}</h4>
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                    <CalendarIcon className="mr-1.5" size={16} />
                                                    {format(event.date, "MMMM d, yyyy")}
                                                </div>
                                                {event.description && (
                                                    <p className="mt-2 text-gray-700 dark:text-gray-200">
                                                        {event.description}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleRemoveEvent(event.id)}
                                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventsAdmin;