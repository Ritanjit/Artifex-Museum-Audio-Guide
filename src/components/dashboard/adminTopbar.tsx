import React, { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, LogOut, RefreshCw, SunMoon, UserCircle, Home } from "lucide-react";
import profilePic from "@/assets/rit.jpg";
import { useTheme } from "@/components/theme-provider/theme-provider";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../lib/contexts/ToastContext";

const AdminTopbar = () => {
    const { theme, setTheme } = useTheme();
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const notifications = [
        "New user feedback received",
        "Event updated successfully",
        "Collection item approved",
    ];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!notifRef.current?.contains(e.target as Node)) setNotifOpen(false);
            if (!profileRef.current?.contains(e.target as Node)) setProfileOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="w-full bg-white dark:bg-zinc-900 shadow-sm px-4 md:px-8 py-4 sticky top-0 
        z-40 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between">
            <h1 className="text-xl font-bold 1 text-black dark:text-white">
                Artifex Admin Dashboard
            </h1>

            <div className="flex items-center gap-4 ml-auto relative">
                {/* Notification Bell */}
                <div ref={notifRef} className="relative">
                    <button
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="p-2 border-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                        aria-label="Notifications"
                    >
                        <Bell size={20} className="text-gray-700 dark:text-white" />
                        {notifications.length !== 0 && (<span className="absolute flex size-3">
                            <span className="absolute -top-[32px] -right-[19.5px] -translate-x-1/2 mt-1 w-2.5 h-2.5 
                            rounded-full bg-amber-400 opacity-75 animate-ping" />
                            <span className="absolute -top-[31px] -right-[17.5px] -translate-x-1/2 mt-1 w-2 h-2 
                            rounded-full bg-amber-500" />
                        </span>)}
                    </button>
                    {notifOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-800 shadow-lg 
                        rounded-lg border dark:border-zinc-700 overflow-hidden">
                            <div className="p-4 border-b dark:border-zinc-600 font-medium text-sm 
                            text-gray-700 dark:text-white flex justify-between items-center">
                                Notifications
                                <button onClick={() => alert("Cleared!")}>
                                    <span className="text-xs text-amber-500 hover:underline">Clear all</span>
                                </button>
                            </div>
                            <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200 dark:divide-zinc-700">
                                {notifications.map((note, index) => (
                                    <li key={index} className="px-4 py-3 text-sm text-gray-800 
                                    dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700">
                                        {note}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Admin Profile Dropdown */}
                <div ref={profileRef} className="relative">
                    <div
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 
                        dark:hover:bg-zinc-800 px-1 py-1 rounded-full transition border-1"
                    >
                        <img
                            src={profilePic}
                            alt="Admin Avatar"
                            className="w-8 h-8 rounded-full border border-gray-300 dark:border-zinc-600 object-cover"
                        />
                        <span className="text-sm font-medium text-gray-800 dark:text-white hidden sm:block">
                            Admin
                        </span>
                        <ChevronDown size={18} className="text-gray-600 dark:text-gray-300 pr-2" />
                    </div>

                    {profileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 shadow-lg 
                        rounded-lg border dark:border-zinc-700 overflow-hidden">
                            <button
                                className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-100 
                                dark:hover:bg-zinc-700 transition text-gray-800 dark:text-white"
                                onClick={() => window.location.reload()}
                            >
                                <RefreshCw size={16} className="mr-2" />
                                Refresh Page
                            </button>

                            <button
                                className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-100 
                                dark:hover:bg-zinc-700 transition text-gray-800 dark:text-white"
                                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                            >
                                <SunMoon size={16} className="mr-2" />
                                Toggle Theme
                            </button>

                            {/* Visit Homepage */}
                            <button
                                className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-100 
                                dark:hover:bg-zinc-700 transition text-gray-800 dark:text-white"
                                onClick={() => navigate("/")}
                            >
                                <Home size={16} className="mr-2" />
                                Visit Homepage
                            </button>

                            {/* Logout */}
                            <button
                                className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-100 
                                dark:hover:bg-zinc-700 transition text-red-600"
                                onClick={() => {
                                    localStorage.removeItem("user");
                                    navigate("/auth");
                                    showToast("Logged out successfully !", "success");
                                }}
                            >
                                <LogOut size={16} className="mr-2" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
